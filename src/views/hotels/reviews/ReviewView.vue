<script setup lang="ts">
import { InputNumber, Card, FloatLabel, Button } from 'primevue'
import Editor from 'primevue/editor'
import Toast from 'primevue/toast';
import { computed, reactive, ref } from 'vue'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../../pocketbase-types.ts'
import { useToast } from 'primevue/usetoast'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const toast = useToast();

const content = ref();
const ratings = reactive({
	FoodRating: 1,
	ServiceRating: 1,
	RoomRating: 1,
	EntertainmentRating: 1,
})

const totalRating = computed(() => {
	return (ratings.FoodRating + ratings.ServiceRating + ratings.RoomRating + ratings.EntertainmentRating) / 4;
})


const onSubmit = async () =>{
	try {
		await pb.collection('reviews').create({
			food_rating: ratings.FoodRating,
			service_rating: ratings.ServiceRating,
			room_rating: ratings.RoomRating,
			entertainment_rating: ratings.EntertainmentRating,
			overall_rating: totalRating.value,
			content: content.value,
		})

		content.value = ''
		ratings.FoodRating = 0
		ratings.ServiceRating = 0
		ratings.RoomRating = 0
		ratings.EntertainmentRating = 0

		toast.add({
			severity: 'success',
			summary: 'Review posted successfully.',
			life: 3000,
			closable: true,
		});
	} catch (error) {
		console.log("Error creating review: ",error)
	}
}
</script>

<template>
	<Toast/>
	<div>
		<div class="flex flex-row gap-5 mb-3">
			<FloatLabel variant="on">
				<InputNumber id="food-review" v-model="ratings.FoodRating"/>
				<label for="food-review">Food Rating</label>
			</FloatLabel>
			<FloatLabel variant="on">
				<InputNumber id="service-review" v-model="ratings.ServiceRating"/>
				<label for="service-review">Service Rating</label>
			</FloatLabel>
			<FloatLabel variant="on">
				<InputNumber id="room-review" v-model="ratings.RoomRating"/>
				<label for="room-review">Room Rating</label>
			</FloatLabel>
			<FloatLabel variant="on">
				<InputNumber id="entertainment-review" v-model="ratings.EntertainmentRating"/>
				<label for="entertainment-review">Entertainment Rating</label>
			</FloatLabel>
		</div>
		<h3>Overall Rating: {{ totalRating }}</h3>

	</div>
	<Editor v-model="content"/>
	<Button :label="$t('submit')" @click="onSubmit" />
</template>

<style scoped>

</style>
