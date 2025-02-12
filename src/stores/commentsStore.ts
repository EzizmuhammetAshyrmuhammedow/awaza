// commentsStore.ts (or similar)
import { ref } from 'vue';
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '../../pocketbase-types.ts'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

export const allComments = ref<any[]>([]); // Store all comments in a flat array

export async function fetchAllComments(hotelId: string) {
	try {
		allComments.value = await pb.collection("comments").getFullList({
			filter: `hotel_id = "${hotelId}"`,
		});
	} catch (error) {
		console.error("Error fetching comments:", error);
	}
}

export function subscribeToComments(hotelId: string) {
	pb.collection('comments').subscribe('*', (e) => {
		if (e.action === 'create' && e.record.hotel_id === hotelId) {
			allComments.value.push(e.record);
		} else if (e.action === 'update') {
			const index = allComments.value.findIndex(c => c.id === e.record.id);
			if (index !== -1) {
				// Replace the entire object to trigger reactivity
				allComments.value[index] = e.record;
			}
		} else if (e.action === 'delete') {
			allComments.value = allComments.value.filter(c => c.id !== e.record.id);
		}
	});
}
