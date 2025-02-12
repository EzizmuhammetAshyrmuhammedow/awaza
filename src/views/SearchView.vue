<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../pocketbase-types.js'
import { Card, Button } from 'primevue'
import { useBookingStore } from '@/stores/booking.ts'

const bookingStore = useBookingStore()
const route = useRoute()

const pb = new PocketBase('http://localhost:8090') as TypedPocketBase

const checkIn = ref<string>(route.query.checkIn?.toString() || '')
const checkOut = ref<string>(route.query.checkOut?.toString() || '')
const guests = ref<number>(Number(route.query.guests) || 1)
const children = ref<number>(Number(route.query.children) || 0)
const rooms = ref<number>(Number(route.query.rooms) || 1)
const hotels = ref<any[]>([])

watch(() => route.fullPath, () => {
	fetchRoomTypes() // Re-fetch data when route changes
})

watch(hotels, (newHotels) => {
	console.log('Updated hotels:', newHotels)
})

async function performSearch() {
	console.log('Searching with:', {
		checkIn: checkIn.value,
		checkOut: checkOut.value,
		guests: guests.value,
		children: children.value,
		rooms: rooms.value,
	})

	try {
		// Step 1: Fetch available rooms
		const availableRooms = await pb.collection('rooms').getList(1, 1000, {
			filter: `available = true`,
			expand: 'hotel', // Expand the hotel relation
		})

		console.log('Available Rooms:', availableRooms.items)

		// Step 2: Group rooms by hotel ID
		const hotelRoomsMap = new Map<string, any[]>()
		for (const room of availableRooms.items) {
			const hotelId = room.hotel // Assuming room.hotel is the hotel ID
			if (!hotelRoomsMap.has(hotelId)) {
				hotelRoomsMap.set(hotelId, [])
			}
			hotelRoomsMap.get(hotelId)!.push(room)
		}

		console.log('Hotel Rooms Map:', hotelRoomsMap)

		// Step 3: Fetch hotels that have at least one available room
		const hotelIds = Array.from(hotelRoomsMap.keys())
		if (hotelIds.length > 0) {
			hotels.value = await pb.collection('hotels').getFullList({
				filter: hotelIds.map((id) => `id = "${id}"`).join(' || '),
			})
		} else {
			hotels.value = [] // No hotels with available rooms
		}
	} catch (error) {
		console.error('Error fetching available hotels:', error)
	}
	console.log(hotels.value)
}

onMounted(() => {
	performSearch()
	pb.collection('rooms').subscribe('*', async (e) => {
		if (e.action === 'create' || e.action === 'delete' || e.action === 'update') {
			await performSearch()
		}
	})
	bookingStore.setGuestAmount(guests.value)
	bookingStore.setRoomAmount(rooms.value)
	bookingStore.setCheckIn(checkIn.value);
	bookingStore.setCheckOut(checkOut.value)
	bookingStore.setChildrenAmount(children.value)
})

onUnmounted(() => {
	pb.collection('rooms').unsubscribe('*')
})
console.log(hotels.value)
</script>

<template>
	<div>
		<h1>Su myhmanhanalarda size görä otaglar bar</h1>
		<div v-if="hotels.length > 0" class="p-card bg-zinc-9">
			<div v-for="hotel in hotels" :key="hotel.id" class="!flex !flex-row gap-3">
				<img
					class="rounded h-auto w-56"
					:src="pb.files.getURL(hotel, hotel.thumbnail)"
					alt=""
				/>
				<div class="flex flex-col items-center justify-start">
					<h2 class="w-full">{{ hotel.name }}</h2>
					<div v-html="hotel.short_description" class="w-full"></div>
					<RouterLink :to="'/hotels/' + hotel.id + '/book'" class="self-start">
						<Button label="bar" color="primary" self-start />
					</RouterLink>
				</div>
			</div>
		</div>
		<p v-else>No hotel available</p>
	</div>
</template>
