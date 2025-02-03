<script setup lang="ts">
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../pocketbase-types.ts'
import { ref, onMounted } from 'vue'
import { Card } from 'primevue'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

// Store grouped room types
const roomGroups = ref<Record<string, { type: string, count: number, thumbnail?: string }>>({});

async function GetRooms() {
	// Fetch room types with expanded room data
	const roomTypes = await pb.collection("room_types").getList(1, 30, {
		expand: "room" // Expands related rooms
	});

	const grouped = roomTypes.items.reduce((acc, roomType) => {
		const rooms = roomType.expand?.room ?? []; // Get related rooms
		const firstRoom = rooms[0]; // Use first room for thumbnail

		acc[roomType.id] = {
			type: roomType.room_type,
			count: rooms.length,
			thumbnail: firstRoom ? pb.files.getUrl(firstRoom, firstRoom.thumbnail) : undefined
		};

		return acc;
	}, {} as Record<string, { type: string, count: number, thumbnail?: string }>);

	roomGroups.value = grouped;
}

onMounted(GetRooms);
</script>

<template>
	<div class="mx-20">
		<h1>Room Types</h1>
		<ul class="grid grid-cols-3 grid-rows-4">
			<Card v-for="(group, typeId) in roomGroups" :key="typeId" class="w-96 ">
				<template #header>
					<img v-if="group.thumbnail" :src="group.thumbnail" alt="Room Image" class="max-h-full max-w-full">
				</template>
				<template #title>
					<h5 class="m-0">{{ group.type }}: {{ group.count }} rooms</h5>

				</template>
			</Card>
		</ul>
	</div>

</template>
