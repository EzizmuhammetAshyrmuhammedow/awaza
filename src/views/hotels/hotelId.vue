<script setup lang="ts">
import PocketBase from 'pocketbase';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Button } from 'primevue';

const route = useRoute();
const id = route.params.id; // Accessing the ID from URL
console.log(id);

const pb = new PocketBase("http://127.0.0.1:8090");
const hotel = ref(null); // Define hotel as a reactive reference

onMounted(async () => {
	try {
		hotel.value = await pb.collection('hotels').getOne(id); // Fetch the hotel data
		console.log(hotel.value);
	} catch (error) {
		console.error("Error fetching hotel:", error);
	}
});
</script>

<template>
	<div v-if="hotel" class="p-8 max-w-4xl mx-auto">
		<!-- Hotel Name -->
		<h1 class="text-4xl font-bold mb-6">{{ hotel.name }}</h1>

		<!-- Hotel Thumbnail -->
		<img
			:src="pb.files.getURL(hotel, hotel.thumbnail)"
			alt="Hotel Thumbnail"
			class="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
		/>

		<!-- Long Description -->
		<div
			class="prose prose-lg max-w-none mb-8"
			v-html="hotel.long_description"
		></div>

		<div flex flex-row gap-5>
			<RouterLink
				:to="'/hotels/' + id + '/reviews/'"
				class="no-underline"
			>
				<Button :label="$t('review', 5)" severity="contrast"/>
			</RouterLink>
			<RouterLink
				:to="'/hotels/' + id + '/comments'"
				class="no-underline"
			>
				<Button :label="$t('comment')" severity="info"/>
			</RouterLink>

			<RouterLink
				:to="'/hotels/' + id + '/rooms'"
				class="no-underline"
			>
				<Button :label="$t('room', 5)" severity="primary"/>
			</RouterLink>
		</div>

	</div>

	<!-- Loading State -->
	<div v-else class="p-8 text-center">
		<p class="text-xl text-gray-600">Loading hotel details...</p>
	</div>
</template>

<style scoped>
/* Add any custom styles here if needed */
</style>
