<script setup lang="ts">
import { ref } from 'vue'
import { Button, Toolbar, Drawer} from 'primevue'
import { useAuthStore } from '@/stores/auth'
import LangSwitcher from '@/components/LangSwitcher.vue'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../pocketbase-types'
import { RouterLink } from 'vue-router'
import { onMounted } from 'vue'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const user = pb.authStore.record
function isAdmin() {
	return user && (user.role === 'Admin' || user.role === 'Employee');
}

const authStore = useAuthStore()

// Drawer visibility for mobile
const DrawerVisible = ref(false)
const toggleDrawer = () => {
	DrawerVisible.value = !DrawerVisible.value
}

const items = ref([
	{
		label: 'Update',
		icon: 'pi pi-refresh'
	},
	{
		label: 'Delete',
		icon: 'pi pi-times'
	}
])
const isDarkMode = ref(false);

const toggleDarkMode = () => {
	isDarkMode.value = !isDarkMode.value;
	document.documentElement.classList.toggle('my-app-dark');
	localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

onMounted(() => {
	if (localStorage.getItem('theme') === 'dark') {
		isDarkMode.value = true;
		document.documentElement.classList.add('my-app-dark');
	}
});
</script>

<template>
	<div class="m0">
		<!-- Mobile Drawer -->
		<Drawer v-model:visible="DrawerVisible" position="left" :baseZIndex="1000" class="!w-64">
			<div class="flex flex-col gap-2 p-3">
				<Button :label="$t('toggle_dark_mode')" @click="toggleDarkMode"/>
				<!-- Drawer menu items -->
				<RouterLink v-if="isAdmin()" to="/dashboard">
					<Button variant="outlined" aria-label="dashboard" class="w-full">{{ $t("dashboard") }}</Button>
				</RouterLink>
				<RouterLink to="/">
					<Button variant="text" aria-label="home" class="w-full">{{ $t("home") }}</Button>
				</RouterLink>
				<a target="_blank" href="https://awaza.zya.me/forum">
					<Button variant="text" aria-label="forum" class="w-full">Forum</Button>
				</a>
				<RouterLink to="/about">
					<Button variant="text" aria-label="about" class="w-full">{{ $t('about') }}</Button>
				</RouterLink>
				<RouterLink to="/hotels">
					<Button variant="text" aria-label="hotels" class="w-full">{{ $t('hotel', 5) }}</Button>
				</RouterLink>
				<div v-if="!authStore.isAuthenticated" class="flex flex-col gap-2">
					<RouterLink to="/login">
						<Button class="w-full">{{ $t("login") }}</Button>
					</RouterLink>
					<RouterLink to="/signup">
						<Button class="w-full">{{ $t("signup") }}</Button>
					</RouterLink>
				</div>
				<div v-else>
					<Button severity="danger" class="w-full" @click="authStore.logout()">{{ $t("logout") }}</Button>
				</div>
				<LangSwitcher/>
			</div>
		</Drawer>

		<!-- Toolbar -->
		<Toolbar class="m0 fixed top-0 left-0 w-full z-99">
			<template #start>
				<RouterLink class="text-2xl m0 no-underline" to="/">Awaza</RouterLink>
			</template>

			<template #center>
				<!-- Optional center content -->
			</template>

			<template #end>
				<!-- Desktop menu (visible on medium screens and up) -->
				<div class="hidden md:flex items-center gap-2 mr-2">
					<Button :label="$t('toggle_dark_mode')" @click="toggleDarkMode"/>
					<RouterLink v-if="isAdmin()" to="/dashboard">
						<Button variant="outlined" aria-label="dashboard">{{ $t("dashboard") }}</Button>
					</RouterLink>
					<RouterLink to="/">
						<Button variant="text" aria-label="home">{{ $t("home") }}</Button>
					</RouterLink>
					<a target="_blank" href="https://awaza.zya.me/forum">
						<Button variant="text" aria-label="forum">Forum</Button>
					</a>
					<RouterLink to="/about">
						<Button variant="text" aria-label="about">{{ $t('about') }}</Button>
					</RouterLink>
					<RouterLink to="/hotels">
						<Button variant="text" aria-label="hotels">{{ $t('hotel', 5) }}</Button>
					</RouterLink>
					<div class="flex items-center gap-2" v-if="!authStore.isAuthenticated">
						<RouterLink to="/login"><Button>{{ $t("login") }}</Button></RouterLink>
						<RouterLink to="/signup"><Button>{{ $t("signup") }}</Button></RouterLink>
					</div>
					<Button severity="danger" v-else @click="authStore.logout()">{{ $t("logout") }}</Button>
					<LangSwitcher/>
				</div>
				<!-- Mobile menu button (visible on small screens) -->
				<div class="flex md:hidden items-center">
					<Button icon="pi pi-bars" @click="toggleDrawer" aria-label="Menu" />
				</div>
			</template>
		</Toolbar>
	</div>
</template>

<style scoped>
/* Add any custom styles here if needed */
</style>
