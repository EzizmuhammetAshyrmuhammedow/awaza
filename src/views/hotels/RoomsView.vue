<script setup lang="ts">
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../pocketbase-types.ts'
import { ref, onMounted } from 'vue'
import { Card, Button } from 'primevue'

interface RoomType {
	id: string;
	room_type: string;
	price: number;
}

interface Room {
	id: string;
	expand?: {
		room_type?: RoomType;
	};
	thumbnail?: string;
}

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

const path = window.location.pathname;
const hotelId = path.split('/')[2];
const user = pb.authStore.record;
console.log(user.id);

// Store grouped room types
const roomGroups = ref<Record<string, { id: string, type: string, count: number, thumbnail?: string, price: number }>>({});
const totalRooms = ref(0); // Total rooms counter

async function GetRooms() {
	console.log(hotelId);

	// Step 1: Fetch rooms that belong to the hotel
	const rooms = await pb.collection("rooms").getList<Room>(1, 100, {
		filter: `hotel = '${hotelId}'`,
		expand: "room_type" // Expand room type
	});

	const grouped = rooms.items.reduce((acc, room) => {
		const roomType = room.expand?.room_type as RoomType | undefined;
		if (!roomType) return acc; // Skip if no room_type

		if (!acc[roomType.id]) {
			acc[roomType.id] = {
				id: roomType.id,
				type: roomType.room_type,
				count: 0,
				thumbnail: room.thumbnail ? pb.files.getURL(room, room.thumbnail) : undefined,
				price: roomType.price,
			};
		}

		acc[roomType.id].count += 1; // Count rooms for this type

		return acc;
	}, {} as Record<string, { id: string, type: string, count: number, thumbnail?: string, price: number }>);

	roomGroups.value = grouped;

	// Calculate total number of rooms
	totalRooms.value = Object.values(grouped).reduce((sum, group) => sum + group.count, 0);
}

onMounted(() => {
	GetRooms();
});
</script>

<template>
	<div class="mx-20">
		<RouterLink :to="'/hotels/' + hotelId + '/rooms/new'"><Button :label="$t('create_new_room_type')"/></RouterLink>
		<h1>Room Types</h1>
		<!-- Display total number of rooms -->
		<p>{{ $t('total_rooms') }}: {{ totalRooms }}</p>
		<ul class="flex flex-row flex-wrap gap-10">
			<Card v-for="(group, typeId) in roomGroups" :key="typeId" class="w-96 ">
				<template #header>
					<img v-if="group.thumbnail" :src="group.thumbnail" alt="Room Image" class="max-h-full max-w-full">
				</template>
				<template #title>
					<h4 class="m-0">{{ group.type }}: {{ group.count }} {{ $t('room') }}</h4>
				</template>
				<template #content>
					<h4 m0>{{ group.price }} TMT</h4>
				</template>
				<template #footer>
					<RouterLink :to="'/hotels/' + hotelId + '/rooms/' + group.id">
						<Button :label="$t('info')"/>
					</RouterLink>
				</template>
			</Card>
		</ul>
	</div>
</template>

