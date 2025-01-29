<script setup lang="ts">
import PocketBase from 'pocketbase';
import { TypedPocketBase } from "pocketbase-types.ts"
import { onMounted, reactive, ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Card, Textarea } from 'primevue';
import { Form } from '@primevue/forms';
import Editor from 'primevue/editor';

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const route = useRoute();
const path = route.path;
const hotelId = path.split('/')[2];

const comments = ref([]);
const editingComment = ref(null);

const FormValues = reactive({
	content: '',
});

onMounted(async () => {
	try {
		comments.value = await pb.collection("comments").getFullList({
			filter: `hotel_id = "${hotelId}"`,
		});
	} catch (error) {
		console.error("Error fetching comments:", error);
	}

	pb.collection('comments').subscribe('*', (e) => {
		if (e.action === 'create' && e.record.hotel_id === hotelId) {
			comments.value.push(e.record);
		} else if (e.action === 'update') {
			const index = comments.value.findIndex(c => c.id === e.record.id);
			if (index !== -1) comments.value[index] = e.record;
		} else if (e.action === 'delete') {
			comments.value = comments.value.filter(c => c.id !== e.record.id);
		}
	});
});

onUnmounted(() => {
	pb.collection('comments').unsubscribe('*');
});

const onSubmit = async () => {
	try {
		if (editingComment.value) {
			await pb.collection("comments").update(editingComment.value.id, {
				content: FormValues.content,
			});
			editingComment.value = null;
		} else {
			await pb.collection("comments").create({
				content: FormValues.content,
				author_id: pb.authStore.record.id,
				hotel_id: hotelId,
			});
		}
		FormValues.content = '';
	} catch (error) {
		console.error("Error submitting comment:", error);
	}
};

const startEditing = (comment) => {
	editingComment.value = comment;
	FormValues.content = comment.content;
};

const cancelEditing = () => {
	editingComment.value = null;
	FormValues.content = '';
};
</script>

<template>
	<ul class="flex flex-col gap-3">
		<Card v-for="comment in comments" :key="comment.id" class="">
			<template #content>
				<p v-html="comment.content"></p>
			</template>
			<template #footer>
				<Button v-if="comment.author_id == pb.authStore.record.id" variant="outlined" @click="startEditing(comment)">Edit</Button>
			</template>
		</Card>
		<Form @submit="onSubmit" class="flex flex-col gap-4 w-56 lg:w-full">
			<div class="p-card !w-full">
				<Editor v-model="FormValues.content" editorStyle="height: 320px" class="!w-full" />
			</div>
			<div class="flex gap-2">
				<Button type="submit" severity="secondary" :label="editingComment ? 'Update' : 'Submit'" />
				<Button v-if="editingComment" variant="outlined" severity="danger" label="Cancel" @click="cancelEditing" />
			</div>
		</Form>
	</ul>
</template>

<style scoped></style>
