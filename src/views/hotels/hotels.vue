<template>
  <div v-for="(hotel, index) in hotels" :key="hotel.id"> <!-- Use hotel.id as key -->
    <Card style="width: 25rem; overflow: hidden">
      <template #header>
        <img class="w-full" alt="hotel thumbnail" :src="pb.files.getURL(hotel, hotel.thumbnail)" /> <!-- Ensure correct usage of getUrl -->
      </template>
      <template #title>{{ hotel.name }}</template>
      <template #content>
        <p v-html="hotel.short_description" class="m0"></p>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <RouterLink :to = "'/hotels/' + hotel.id"  class="w-full"><Button label="Bar" class="w-full" /></RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'; // Import necessary Vue functions
import Card from 'primevue/card';
import Button from 'primevue/button';
import PocketBase from 'pocketbase';

const pb = new PocketBase("http://127.0.0.1:8090/");
const hotels = ref([]); // Initialize hotels as a reactive reference

onMounted(async () => {
  try {
    hotels.value = await pb.collection("hotels").getFullList(); // Fetch hotels asynchronously
    console.log(pb.files.getURL(hotels ,hotels.value[0].thumbnail));
  } catch (error) {
    console.error("Error fetching hotels:", error); // Error handling
  }
});
</script>

<style scoped>
/* Add any necessary styles here */
</style>
