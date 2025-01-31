<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import { Button, SplitButton } from 'primevue';
import Menubar from 'primevue/menubar';


import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Adjust path as necessary

const authStore = useAuthStore();
const authenticated = ref(false);

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
</script>

<template>
  <div class="m0">
    <Toolbar class="m0 fixed top-0 left-0 w-full">
      <template #start>
        <RouterLink class="text-2xl m0 no-underline" to="/">Awaza</RouterLink>
      </template>

      <template #center>

      </template>

      <template #end>
        <div class="flex items-center gap-2 mr-2">
			<RouterLink v-if="!authStore.isAdmin" to="/dashboard"><Button variant="outlined" label="Dashboard" aria-label="dashboard"/></RouterLink>
			<RouterLink to="/"><Button variant="text" label="Home" aria-label="home"/></RouterLink>
          <RouterLink to="/about"><Button variant="text" label="About" aria-label="about"/></RouterLink>
          <RouterLink to="/hotels"><Button variant="text" label="Hotels" aria-label="hotels"/></RouterLink>
        </div>
        <div class="flex flex-row items-center gap-2" v-if="!authStore.isAuthenticated">
          <RouterLink to="/login"><Button>Log in</Button></RouterLink>
          <RouterLink to="/signup"><Button>Sign Up</Button></RouterLink>
        </div>
        <Button severity="danger" v-else @click="authStore.logout()">Logout</Button>
      </template>
    </Toolbar>
  </div>
</template>
