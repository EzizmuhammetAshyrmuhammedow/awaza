<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../../../pocketbase-types.ts'

const props = defineProps({
	hotelId: String,
})

// Initialize PocketBase instance
const pb = new PocketBase("http://localhost:8090") as TypedPocketBase

// Reactive variables for customers this month and last month
const customersThisMonth = ref<number>(0)
const customersLastMonth = ref<number>(0)

// Function to fetch customers for a given month
async function fetchCustomersForMonth(year: number, month: number, targetRef: any) {
	try {
		const firstDay = new Date(year, month, 1).toISOString();
		const lastDay = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
		console.log(firstDay, lastDay)
		// Query PocketBase for bookings within the specified month
		const bookingsData = await pb.collection('bookings').getFullList({
			filter: `hotel.id = '${props.hotelId}' && check_in >= "${firstDay}" && check_in <= '${lastDay}' && cancelled = false`,
			requestKey: null // Disables auto-cancellation
		})


		// Sum the 'guests' field
		let totalCustomers = 0
		bookingsData.forEach(booking => {
			totalCustomers += booking.guests
		})

		targetRef.value = totalCustomers
	} catch (error) {
		console.error("Error fetching customers:", error)
	}
}

onMounted(() => {
	const now = new Date()
	fetchCustomersForMonth(now.getFullYear(), now.getMonth(), customersThisMonth) // Current month
	fetchCustomersForMonth(now.getFullYear(), now.getMonth() - 1, customersLastMonth) // Last month

})
</script>

<template>
	<div class="p-card mb-0 p-3">
		<div class="flex justify-between mb-4">
			<div>
				<span class="block opacity-60 font-medium mb-4 text-blue-3">{{ $t('customer', 5) }}</span>
				<div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
					{{ customersThisMonth }}
				</div>
			</div>
			<div
				class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-lg"
				style="width: 2.5rem; height: 2.5rem"
			>
				<i class="pi pi-users text-cyan-500 !text-xl"></i>
			</div>
		</div>
		<div class="flex gap-1">
			<span class="text-primary font-medium">{{ customersLastMonth }}</span>
			<span class="opacity-60">{{ $t('last_month') }}</span>
		</div>
	</div>
</template>

<style scoped>
/* Add any custom styling if needed */
</style>
