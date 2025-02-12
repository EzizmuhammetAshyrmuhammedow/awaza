<script setup lang="ts">
import SearchHotel from '@/components/SearchHotel.vue'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const route = useRouter();

watch(() => route.fullPath, () => {
	fetchRoomTypes() // Re-fetch data when route changes
})
</script>

<template>
  <main class="flex justify-center items-center h-screen pb-40 overflow-hidden">
	  <SearchHotel/>
  </main>
</template>
