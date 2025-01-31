<script setup lang="ts">
import StatsWidget from '@/views/dashboard/components/StatsWidget.vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../pocketbase-types.ts'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

const hotelId = pb.authStore.record.hotel_id;

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

const barChartData = {
	labels: ['January', 'February', 'March', 'April', 'May'],
	datasets: [
		{
			label: 'Revenue',
			backgroundColor: '#FFA726',
			data: [45, 69, 90, 81, 62],
		},
	],
};

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
};
</script>

<template>
	<main class="p-6">
		<div class="text-2xl font-semibold mb-4">Welcome to the Dashboard</div>

		<!-- Charts -->
		<div class="grid grid-cols-12 gap-4">
			<Suspense>
				<StatsWidget v-if="hotelId" class="col-span-1" :hotel-id="hotelId"/>
			</Suspense>
			<Card class="p-4 col-span-6">
				<template #header>
					<h3 class="text-lg font-medium mb-2">Line Chart</h3>
				</template>
				<template #content>
					<Chart type="line" :data="lineChartData" :options="chartOptions" />
				</template>
			</Card>

			<Card class="p-4 col-span-6">
				<template #header>
					<h3 class="text-lg font-medium mb-2">Bar Chart</h3>
				</template>
				<template #content>
					<Chart type="bar" :data="barChartData" :options="chartOptions" />
				</template>
			</Card>
		</div>
	</main>
</template>

<style scoped>

</style>
