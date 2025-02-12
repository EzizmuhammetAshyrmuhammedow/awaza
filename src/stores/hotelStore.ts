import { defineStore } from 'pinia'
import { ref } from 'vue'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../pocketbase-types.ts'

const pb = new PocketBase('http://127.0.0.1:8090') as TypedPocketBase

export const useHotelStore = defineStore('hotels', () => {
	const averageRating = ref(0)
	const totalRating = ref(0)
	const comments = ref<any[]>([]) // explicitly define comments as an array

	const getAverageRating = async (hotelId: string) => { //pass hotelId when calling the function
		const record = await pb.collection('comments').getFullList({
			filter: `hotel_id = "${hotelId}" && overall_rating != 0`,
		});
		comments.value = record;
		for (let i = 0; i < comments.value.length; i++) {
			totalRating.value += comments.value[i].overall_rating;
		}
		averageRating.value = totalRating.value / comments.value.length
		return averageRating
	}
	const SetAverageHotelRating = async (hotelId: string) => { //pass hotelId when calling the function
		await getAverageRating(hotelId)
		await pb.collection('hotels').update(hotelId, {
			rating: averageRating
		})
	}
	return { getAverageRating, SetAverageHotelRating, averageRating}
})
