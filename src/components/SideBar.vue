<template>
  <div class="card flex justify-center w-full">
    <PanelMenu :model="items" class="w-full md:w-80" />
  </div>
</template>

<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu';
import { Button } from 'primevue'

import { ref } from "vue";

const visible = ref(false);

const items = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    link: '/',
  },
  {
    label: 'About',
    icon: 'pi pi-info',
    link: '/about',
  },
  {
    label: 'Hotels',
    icon: 'pi pi-building',
    link: '/hotels',
  }
]
</script>
