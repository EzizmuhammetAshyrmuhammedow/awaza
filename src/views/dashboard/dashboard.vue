<template>
	<div class="flex h-screen">
		<div class="flex md:hidden items-center">
			<Button icon="pi pi-bars" @click="toggleDrawer" aria-label="Menu" />
		</div>
		<Drawer v-model:visible="DrawerVisible" position="left" :baseZIndex="1000" class="p-4">
			<PanelMenu :model="menuItems" class="p-4" />
		</Drawer>
		<!-- Sidebar -->
		<Card class="w-64 !p-0 rounded-lg mr-2 ml-2 fixed top-20 left-0 h-[calc(100vh-6rem)] overflow-y-auto hidden md:block">
			<template #content>
				<PanelMenu :model="menuItems" class="" />
			</template>
		</Card>
		<div class="flex-1 md:ml-64">
			<RouterView />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import { onMounted, ref, watch } from 'vue';
import PanelMenu from 'primevue/panelmenu'
import { Button, Drawer, Card } from 'primevue'
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

const user = pb.authStore.record
const userRole = ref(user?.role || 'Customer'); // Fallback role if user is undefined

const menuItems = ref([
	{
		label: t('employee'),
		icon: 'pi pi-users',
		command: () => router.push(`/hotels/${hotelId.value}/employees`),
		visible: true, // Ensure explicit boolean value
	},
	{
		label: t('analytics'),
		icon: 'pi pi-chart-line',
		command: () => router.push("/dashboard"),
		visible: user.role !== 'Employee', // Ensure this always resolves to boolean
	},
	{
		label: t('room'),
		icon: 'pi pi-building',
		command: () => router.push("/dashboard/rooms"),
		visible: true,
	},
	{
		label: t('bookings'),
		icon: 'pi pi-book',
		command: () => router.push("/dashboard/bookings"),
		visible: true,
	},
	{
		label: t('settings'),
		icon: 'pi pi-cog',
		command: () => router.push("/dashboard/settings"),
		visible: user.role !== 'Employee',
	},
]);

watch(
	() => t('employee'), // Watch for language changes
	() => {
		menuItems.value = [
			{
				label: t('employee'),
				icon: 'pi pi-users',
				command: () => router.push(`/hotels/${hotelId.value}/employees`),
				visible: true,
			},
			{
				label: t('analytics'),
				icon: 'pi pi-chart-line',
				command: () => router.push("/dashboard"),
				visible: userRole.value !== 'Employee',
			},
			{
				label: t('room'),
				icon: 'pi pi-building',
				command: () => router.push("/dashboard/rooms"),
				visible: true,
			},
			{
				label: t('bookings'),
				icon: 'pi pi-book',
				command: () => router.push("/dashboard/bookings"),
				visible: true,
			},
			{
				label: t('settings'),
				icon: 'pi pi-cog',
				command: () => router.push("/dashboard/settings"),
				visible: userRole.value !== 'Employee',
			},
		];
	}
);

</script>


<style>
/* Additional styles if needed */
</style>
