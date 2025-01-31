<template>
	<div class="flex h-screen">
		<!-- Sidebar -->
		<aside class="w-64 bg-zinc-950 rounded-lg mr-2 fixed top-20 left-0 h-[calc(100vh-6rem)] overflow-y-auto">
			<PanelMenu :model="menuItems" class="p-4" />
		</aside>
		<div class="flex-1 ml-64">
			<RouterView/>
		</div>
	</div>
</template>

<script setup lang="ts">
// Your existing script setup code remains unchanged
import { onMounted, ref } from 'vue';

import PanelMenu from 'primevue/panelmenu';
import PocketBase from 'pocketbase';
import StatsWidget from '@/views/dashboard/components/StatsWidget.vue'
import { useRouter } from 'vue-router'

const router = useRouter();
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
		label: 'Employees',
		icon: 'pi pi-users',
		command: () => router.push(`/hotels/${hotelId.value}/employees`),
	},
	{
		label: 'Analytics',
		icon: 'pi pi-chart-line',
		command: () => router.push("/dashboard"),
	},
	{
		label: 'Settings',
		icon: 'pi pi-cog',
		command: () => console.log('Navigating to Settings'),
	},
]
</script>

<style>
/* Additional styles if needed */
</style>
