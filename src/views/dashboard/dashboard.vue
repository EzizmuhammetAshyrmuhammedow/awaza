<template>
	<div class="flex h-screen">
		<!-- Sidebar -->
		<aside class="w-64 bg-zinc-950 rounded-lg mr-2 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto">
			<PanelMenu :model="menuItems" class="p-4" />
		</aside>
		<div class="flex-1 ml-64"> <!-- Adjusted for sidebar width -->
			<!-- Main Content Area -->
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
		</div>
	</div>
</template>

<script setup lang="ts">
// Your existing script setup code remains unchanged
import { onMounted, ref } from 'vue';
import Chart from 'primevue/chart';
import Card from 'primevue/card';
import PanelMenu from 'primevue/panelmenu';
import PocketBase from 'pocketbase';
import StatsWidget from '@/views/dashboard/components/StatsWidget.vue'

const pb = new PocketBase("http://localhost:8090");
const hotels = ref();
const hotelId = ref(null);
const owner_id = pb.authStore.record.id;

onMounted(() => {
	getHotel(owner_id);
});

async function getHotel(ownerId) {
	try {
		hotels.value = await pb.collection('hotels').getFullList({
			filter: `owner_id = "${ownerId}"`,
		});
		hotelId.value = hotels.value?.[0]?.id;
		return hotels;
	} catch (error) {
		console.error('Error fetching hotels:', error);
	}
}

const menuItems = [
	{
		label: 'Analytics',
		icon: 'pi pi-chart-line',
		command: () => console.log('Navigating to Analytics'),
	},
	{
		label: 'Settings',
		icon: 'pi pi-cog',
		command: () => console.log('Navigating to Settings'),
	},
];

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

<style>
/* Additional styles if needed */
</style>
