<script setup lang="ts">
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../pocketbase-types.ts'
import { ref, onMounted, computed } from 'vue'
import { useBookingStore } from '@/stores/booking.ts'
import{ Card, Button } from 'primevue'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const bookingStore = useBookingStore();

const guests = bookingStore.guest_amount;
const rooms = bookingStore.room_amount;
const check_in = bookingStore.check_in;
const check_out = bookingStore.check_out;

const roomTypes = ref<{ id: string; type: string; capacity: number; price: number; thumbnail?: string }[]>([]);
const assignedRooms = ref<{ type: string; count: number; guests: number; price: number }[]>([]);
const bookingStatus = ref<string | null>(null);

// Computed property to calculate total price
const totalPrice = computed(() => assignedRooms.value.reduce((sum, room) => sum + room.count * room.price, 0));

async function fetchRoomTypes() {
	const roomData = await pb.collection("room_types").getList(1, 30, { expand: "room" });

	roomTypes.value = roomData.items.map(roomType => ({
		id: roomType.id,
		type: roomType.room_type,
		capacity: roomType.capacity,
		price: roomType.price, // Make sure this field exists in PocketBase
		thumbnail: roomType.expand?.room?.[0]?.thumbnail
			? pb.files.getUrl(roomType.expand.room[0], roomType.expand.room[0].thumbnail)
			: undefined
	}));

	assignRooms();
}

function assignRooms() {
	let remainingGuests = guests;
	let remainingRooms = rooms;
	assignedRooms.value = [];

	// Sort room types by capacity (descending) to prioritize larger rooms
	const sortedRooms = [...roomTypes.value].sort((a, b) => b.capacity - a.capacity);

	for (const room of sortedRooms) {
		if (remainingGuests <= 0 || remainingRooms <= 0) break;
		const roomsNeeded = Math.min(Math.floor(remainingGuests / room.capacity), remainingRooms);
		const guestsAssigned = roomsNeeded * room.capacity;
		if (roomsNeeded > 0) {
			assignedRooms.value.push({ type: room.type, count: roomsNeeded, guests: guestsAssigned, price: room.price });
			remainingGuests -= guestsAssigned;
			remainingRooms -= roomsNeeded;
		}
	}

	// If guests are still remaining, put them in the smallest available rooms
	for (const room of sortedRooms.reverse()) {
		if (remainingGuests <= 0 || remainingRooms <= 0) break;
		const roomsNeeded = Math.min(remainingRooms, Math.ceil(remainingGuests / room.capacity));
		const guestsAssigned = Math.min(remainingGuests, roomsNeeded * room.capacity);
		if (roomsNeeded > 0) {
			assignedRooms.value.push({ type: room.type, count: roomsNeeded, guests: guestsAssigned, price: room.price });
			remainingGuests -= guestsAssigned;
			remainingRooms -= roomsNeeded;
		}
	}
}

async function bookRooms() {
	try {
		const bookingData = {
			user: pb.authStore.record.id,
			guests: guests,
			total_price: totalPrice.value,
			rooms: JSON.stringify(assignedRooms.value),
			check_in: check_in,
			check_out: check_out,
		};

		await pb.collection("bookings").create(bookingData);
		bookingStatus.value = "Booking successful!";
	} catch (error) {
		console.error("Booking failed:", error);
		bookingStatus.value = "Booking failed. Try again.";
	}
}


function getThumbnail(type: string) {
	const room = roomTypes.value.find(r => r.type === type);
	return room?.thumbnail;
}

onMounted(fetchRoomTypes);
</script>

<template>
	<h1>Your Room Assignment</h1>
	<p>Total Guests: {{ guests }} | Total Rooms: {{ rooms }}</p>

	<ul class="flex flex-row gap-5">
		<Card v-for="room in assignedRooms" :key="room.type" class="w-56 h-72 !bg-zinc-900">
			<template #header>
				<img v-if="getThumbnail(room.type)" :src="getThumbnail(room.type)" alt="Room thumbnail" class="max-h-full max-w-full" />
			</template>
			<template #content>
				<h3>{{ room.type }}: {{ room.count }} rooms ({{ room.guests }} guests)</h3>
			</template>
		</Card>
	</ul>

	<h2>Total Price: ${{ totalPrice }}</h2>

	<Button @click="bookRooms">Confirm Booking</Button>
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
