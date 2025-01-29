<script setup lang="ts">
import PocketBase from 'pocketbase';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

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
	<div v-if="hotel">
		<h1>{{ hotel.name }}</h1>
		<img :src="pb.files.getURL(hotel, hotel.thumbnail)" alt="Hotel Thumbnail" />
		<div v-html="hotel.long_description"></div>
		<h2>Short Description</h2>
		<div v-html="hotel.short_description"></div>
		<h3>Photos</h3>
<!--		<img :src="pb.files.getURL(hotel, hotel.photos[1])" alt="">-->
		<RouterLink :to="'/hotels/' + id + '/comments'" >Teswir Yav</RouterLink>
	</div>
	<div v-else>
		<p>Loading hotel details...</p>
	</div>
</template>

<style scoped>
/* Add any styles you need here */
img {
	max-width: 100%;
	height: auto;
}
</style>
