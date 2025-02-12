<template>
	<div class="flex h-screen">
		<div class="flex md:hidden items-center">
			<Button icon="pi pi-bars" @click="toggleDrawer" aria-label="Menu" />
		</div>
		<Drawer v-model:visible="DrawerVisible" position="left" :baseZIndex="1000" class="p-4">
			<PanelMenu :model="menuItems" class="p-4" />

		</Drawer>
		<!-- Sidebar -->
		<aside class="w-64 bg-zinc-950 rounded-lg mr-2 fixed top-20 left-0 h-[calc(100vh-6rem)] overflow-y-auto hidden md:block">
			<PanelMenu :model="menuItems" class="p-4" />
		</aside>
		<div class="flex-1 md:ml-64">
			<RouterView/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Your existing script setup code remains unchanged
import { onMounted, ref } from 'vue';
import PanelMenu from 'primevue/panelmenu'
import { Button, Drawer} from 'primevue'
import PocketBase from 'pocketbase';
import { useRouter } from 'vue-router'

const router = useRouter();
const pb = new PocketBase("http://localhost:8090");
const hotels = ref();
const hotelId = ref(null);
const owner_id = pb.authStore.record.id;

const DrawerVisible = ref(false)
const toggleDrawer = () => {
	DrawerVisible.value = !DrawerVisible.value
}

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
		label: 'Işçiler',//t('employee', 5),
		icon: 'pi pi-users',
		command: () => router.push(`/hotels/${hotelId.value}/employees`),
	},
	{
		label: 'Analitika',// t('analytics'),
		icon: 'pi pi-chart-line',
		command: () => router.push("/dashboard"),
	},
	{
		label: 'Otaglar', //t('room', 5),
		icon: 'pi pi-building',
		command: () => router.push("/dashboard/rooms"),
	},
	{
		label: 'Bronlar',//t('bookings'),
		icon: 'pi pi-book',
		command: () => router.push("/dashboard/bookings"),
	},
	{
		label: 'Sazlamalar', //'t('settings'),
		icon: 'pi pi-cog',
		command: () => router.push("/dashboard/settings"),
	},
]
</script>

<style>
/* Additional styles if needed */
</style>
