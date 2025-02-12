<template>
	<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<div v-for="(hotel, index) in hotels" :key="hotel.id">
			<Card class="h-full flex flex-col" style="width: 25rem; overflow: hidden">
				<template #header>
					<img class="w-full h-48 object-cover" alt="hotel thumbnail" :src="pb.files.getURL(hotel, hotel.thumbnail)" />
				</template>
				<template #title>{{ hotel.name }}</template>
				<template #content>
					<div class="flex-grow min-h-[4rem]">  <p v-html="hotel.short_description" class="m0"></p>
					</div>
				</template>
				<template #footer>
					<div class="flex gap-4 mt-2">
						<RouterLink :to="'/hotels/' + hotel.id" class="w-full">
							<Button :label="$t('view')" class="w-full" />
						</RouterLink>
					</div>
				</template>
			</Card>
		</div>
	</section>
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
