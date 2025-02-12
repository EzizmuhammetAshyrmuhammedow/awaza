<script setup lang="ts">
import StatsWidget from '@/views/dashboard/components/StatsWidget.vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../pocketbase-types.ts'
import { onMounted, ref } from 'vue'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const userId = pb.authStore.record.id;
const hotel= ref();
const hotelId = ref()
console.log(hotel)

async function getHotelId() {
	try {
		hotel.value = await pb.collection('hotels').getFirstListItem(`owner_id = "${userId}"`);
		hotelId.value = hotel.value?.id || null;
	} catch (error) {
		console.error("Failed to fetch hotel:", error);
		hotel.value = null;
		hotelId.value = null;
	}
}

const lineChartData = {
	labels: ['January', 'February', 'March', 'April', 'May'],
	datasets: [
		{
			label: 'Sales',
			data: [65, 59, 80, 81, 56],
			borderColor: '#42A5F5',
			fill: false,
		},
	],
};

const guestsChartData = ref({
	labels: [],
	datasets: [
		{
			label: 'Guests Booked',
			backgroundColor: '#FFA726',
			data: [],
		},
	],
});

async function fetchGuestData() {
	try {
		if (!hotelId.value) return;

		const bookings = await pb.collection('bookings').getFullList({
			filter: `hotel.id = "${hotelId.value}"`,
		});

		// Process the data (e.g., count guests per month)
		const monthlyGuests = {};
		bookings.forEach((booking) => {
			const month = new Date(booking.created).toLocaleString('default', { month: 'long' });
			monthlyGuests[month] = (monthlyGuests[month] || 0) + booking.guests;
		});

		// Update chart data
		guestsChartData.value = {
			labels: Object.keys(monthlyGuests),
			datasets: [
				{
					label: 'Guests Booked',
					backgroundColor: '#FFA726',
					data: Object.values(monthlyGuests),
				},
			],
		};
	} catch (error) {
		console.error('Failed to fetch booking data:', error);
	}
}


const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
};

onMounted(async () => {
	await getHotelId();
	await fetchGuestData();
});
</script>

<template>
	<main class="p-6">
		<div class="text-2xl font-semibold mb-4">{{ $t('welcome_to_dashboard') }}</div>

		<!-- Charts -->
		<div class="grid grid-cols-12 gap-4">
			<Suspense>
				<StatsWidget v-if="hotelId" class="col-span-1" :hotel-id="hotelId"/>
			</Suspense>

			<Card class="p-4 col-span-12">
				<template #header>
					<h3 class="text-lg font-medium mb-2">{{ $t('hotel_guests_over_time') }}</h3>
				</template>
				<template #content>
					<Chart type="bar" :data="guestsChartData" :options="chartOptions" />
				</template>
			</Card>

		</div>
	</main>
</template>

<style scoped>

</style>
