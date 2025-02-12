<script setup lang="ts">
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../pocketbase-types.ts'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useBookingStore } from '@/stores/booking.ts'
import { Card, Button } from 'primevue'


const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const bookingStore = useBookingStore();
const guests = bookingStore.guest_amount + bookingStore.children_amount;
const rooms = bookingStore.room_amount;
const check_in = bookingStore.check_in;
const check_out = bookingStore.check_out;
const roomTypes = ref<
	{ id: string; type: string; capacity: number; price: number; thumbnail?: string }[]
>([]);
const assignedRooms = ref<{ type: string; count: number; guests: number; price: number }[]>([]);
const bookingStatus = ref<string | null>(null);

const path = window.location.pathname
const hotelId = String(path.split('/')[2])
console.log(hotelId)
// For cleaning up the interval
let checkInterval: number | undefined;

// Computed property to calculate total price
const totalPrice = computed(() => assignedRooms.value.reduce((sum, room) => sum + room.count * room.price, 0));

async function fetchRoomTypes() {
	const roomData = await pb.collection("room_types").getList(1, 30, {
		expand: "room",
	});

	interface RoomExpand {
		room?: { thumbnail: string }[];
	}

	roomTypes.value = roomData.items.map(roomType => {
		const expand = roomType.expand as RoomExpand | undefined;
		return {
			id: roomType.id,
			type: roomType.room_type,
			capacity: roomType.capacity,
			price: roomType.price,
			thumbnail: expand?.room?.[0]?.thumbnail
				? pb.files.getURL(expand.room[0], expand.room[0].thumbnail)
				: undefined
		}
	});

	await assignRooms();
}

async function assignRooms() {
	let remainingGuests = guests;
	let remainingRooms = rooms;
	assignedRooms.value = [];

	// Sort room types by how close their capacity is to the guest count
	const sortedRooms = [...roomTypes.value].sort((a, b) => {
		const diffA = Math.abs(a.capacity - guests);
		const diffB = Math.abs(b.capacity - guests);
		return diffA - diffB;
	});

	// First loop: try to assign using the best-fit rooms
	for (const room of sortedRooms) {
		if (remainingGuests <= 0 || remainingRooms <= 0) break;

		// Query available rooms for this room type
		const availableRooms = await pb.collection("rooms").getList(1, remainingRooms, {
			filter: `available = true && room_type = "${room.id}"`
		});

		// Calculate rooms needed using floor division
		const roomsNeeded = Math.min(availableRooms.items.length, Math.floor(remainingGuests / room.capacity));
		const guestsAssigned = roomsNeeded * room.capacity;
		if (roomsNeeded > 0) {
			assignedRooms.value.push({
				type: room.type,
				count: roomsNeeded,
				guests: guestsAssigned,
				price: room.price
			});
			remainingGuests -= guestsAssigned;
			remainingRooms -= roomsNeeded;
		}
	}

	// Second loop: assign any remaining guests to available rooms
	// (we can use the same sorted order here)
	for (const room of sortedRooms) {
		if (remainingGuests <= 0 || remainingRooms <= 0) break;

		const availableRooms = await pb.collection("rooms").getList(1, remainingRooms, {
			filter: `available = true && room_type = "${room.id}"`
		});

		// Use ceil so that even if one guest remains, a room is assigned.
		const roomsNeeded = Math.min(availableRooms.items.length, Math.ceil(remainingGuests / room.capacity));
		// Here, decide if you want to show the full room capacity or the actual guest count:
		// For display purposes (if you want to show the room's full capacity):
		const guestsAssigned = roomsNeeded * room.capacity;
		// Alternatively, if you want to subtract only the number of remaining guests:
		// const guestsAssigned = Math.min(remainingGuests, roomsNeeded * room.capacity);

		if (roomsNeeded > 0) {
			assignedRooms.value.push({
				type: room.type,
				count: roomsNeeded,
				guests: guestsAssigned,
				price: room.price
			});
			// Deduct only what is actually needed.
			remainingGuests -= Math.min(remainingGuests, guestsAssigned);
			remainingRooms -= roomsNeeded;
		}
	}
}



/**
 * Updates the physical room records by marking them unavailable.
 * Returns an array of booked room record IDs.
 */
async function updateRoomAvailability(): Promise<string[]> {
	const bookedRoomIds: string[] = [];
	try {
		for (const assigned of assignedRooms.value) {
			// Find the corresponding room type record using the room type name.
			const roomTypeRecord = roomTypes.value.find(rt => rt.type === assigned.type);
			if (!roomTypeRecord) continue;

			// Query available rooms for this room type.
			const availableRooms = await pb.collection("rooms").getList(1, assigned.count, {
				filter: `available = true && room_type = "${roomTypeRecord.id}"`
			});

			// Mark each found room as unavailable and collect its ID.
			for (const room of availableRooms.items) {
				await pb.collection("rooms").update(room.id, { available: false });
				bookedRoomIds.push(room.id);
			}
		}
	} catch (error) {
		console.error("Failed to update room availability:", error);
	}
	return bookedRoomIds;
}

async function bookRooms() {
	try {

		// First update room availability and get the booked room IDs.
		const bookedRoomIds = await updateRoomAvailability();

		// Create the booking record with the room relation field.
		const bookingData = {
			user: pb.authStore.record.id,
			hotel: hotelId,
			guests: guests,
			total_price: totalPrice.value,
			// Remove the JSON field and attach the booked room IDs to the relation field.
			room: bookedRoomIds,
			check_in: new Date(check_in).toISOString(), // Convert to ISO string.
			check_out: new Date(check_out).toISOString(), // Convert to ISO string.
			cancelled: false
		};

		await pb.collection("bookings").create(bookingData);
		bookingStatus.value = "Booking successful!";
	} catch (error) {
		console.error("Booking failed:", error);
		bookingStatus.value = "Booking failed. Try again.";
	}
}

/**
 * Periodically check for bookings where the current date is past (or equal to) the check out date.
 * For each such booking, update the rooms to available again and mark the booking as cancelled.
 */
async function checkBookingsForCheckout() {
	try {
		const nowISO = new Date().toISOString();
		// Query bookings that have expired and are not yet cancelled.
		const bookingsData = await pb.collection("bookings").getList(1, 50, {
			filter: `check_out <= "${nowISO}" && cancelled = false`
		});

		for (const booking of bookingsData.items) {
			// Use the relation field "room" (an array of booked room IDs) instead of JSON.
			const bookedRoomIds = booking.room;
			if (Array.isArray(bookedRoomIds)) {
				for (const roomId of bookedRoomIds) {
					await pb.collection("rooms").update(roomId, { available: true });
				}
			}

			// Mark the booking as cancelled (or expired).
			await pb.collection("bookings").update(booking.id, { cancelled: true });
		}
	} catch (error) {
		console.error("Error during booking cancellation:", error);
	}
}

function getThumbnail(type: string) {
	const room = roomTypes.value.find(r => r.type === type);
	return room?.thumbnail;
}

onMounted(async () => {
	await fetchRoomTypes();

	// Start an interval to check for expired bookings every minute.
	checkInterval = setInterval(checkBookingsForCheckout, 60000);
});
onUnmounted(() => {
	if (checkInterval) {
		clearInterval(checkInterval);
	}
});
</script>

<template>
	<h1>{{ $t('room', 5) }}</h1>
	<p>{{ $t('total_guests') }}: {{ guests }} | {{ $t('total_rooms') }}: {{ rooms }}</p>

	<ul class="flex flex-row gap-5">
		<Card v-for="room in assignedRooms" :key="room.type" class="w-56 h-72 !bg-zinc-900">
			<template #header>
				<img v-if="getThumbnail(room.type)" :src="getThumbnail(room.type)" alt="Room thumbnail" class="max-h-full max-w-full" />
			</template>
			<template #content>
				<h3>{{ room.type }}: {{ room.count }} {{ $t('room', 5) }} ({{ room.guests }} {{ $t('total_guests') }})</h3>
			</template>
		</Card>
	</ul>

	<h2>{{ $t('total_price') }}: {{ totalPrice }} TMT</h2>

	<Button @click="bookRooms">{{ $t('confirm_booking') }}</Button>
	<p v-if="bookingStatus">{{ bookingStatus }}</p>
</template>

<style scoped>
h1 {
	margin-bottom: 10px;
}
h3 {
	margin-top: 10px;
}
h2 {
	margin-top: 15px;
}
button {
	margin-top: 10px;
	padding: 10px 15px;
	background-color: #007bff;
	color: white;
	border: none;
	cursor: pointer;
	border-radius: 5px;
}
button:hover {
	background-color: #0056b3;
}
</style>
