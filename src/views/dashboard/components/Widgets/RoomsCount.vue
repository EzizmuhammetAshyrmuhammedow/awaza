<script setup lang="ts">
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../../../pocketbase-types.ts'
import { onMounted, ref } from 'vue'

const props = defineProps<{ hotelId: string }>()
console.log(props.hotelId)

const pb = new PocketBase('http://localhost:8090') as TypedPocketBase
const totalItems = ref(0)
const availableRoomsCount = ref(0)

async function getRoomsCount() {
	const { totalItems: count } = await pb.collection('rooms').getList(1, 1, {
		filter: `hotel.id = "${props.hotelId}"`,
	})
	totalItems.value = count
}

async function getAvailableRoomsCount() {
	const availableRooms = pb.collection('rooms').getList(1, 1, {
		filter: 'available = true'
	})
	availableRoomsCount.value = (await availableRooms).totalItems
}

onMounted(async () => {
	await getRoomsCount()
	await getAvailableRoomsCount()
	pb.collection('rooms').subscribe('*', async (e) => {
		if (e.action === 'create' || e.action === 'delete' || e.action === 'update') {
			await getRoomsCount()
			await getAvailableRoomsCount()
		}
	})
})
console.log(totalItems)
</script>

<template>
	<div class="p-card mb-0 p-3">
		<div class="flex justify-between mb-4">
			<div>
				<span class="block opacity-60 font-medium mb-4 text-blue-3">{{ $t('room', 5) }}</span>
				<div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalItems }}</div>
			</div>
			<div
				class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-lg"
				style="width: 2.5rem; height: 2.5rem"
			>
				<i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
			</div>
		</div>
		<div class="flex gap-1">
			<span class="text-primary font-medium">{{ availableRoomsCount }} {{ $t('available') }} </span>
		</div>
	</div>
</template>

<style scoped></style>
