<script setup lang="ts">
import PocketBase from 'pocketbase';
import { TypedPocketBase } from "pocketbase-types.ts"
import { onMounted, reactive, ref, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Card, Textarea } from 'primevue';
import { Form } from '@primevue/forms';
import Editor from 'primevue/editor';

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

const route = useRoute();
const path = route.path;
const hotelId = path.split('/')[2];

const comments = ref([]);
const editingCommentId = ref(null);
const formRef = ref(null);
const commentRef = ref({}); // Store references for comments

// Form state
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
		}
		else if (e.action === 'update') {
			const index = comments.value.findIndex(c => c.id === e.record.id);
			if (index !== -1) {
				comments.value[index] = e.record;
			}
		}
		else if (e.action === 'delete') {
			comments.value = comments.value.filter(c => c.id !== e.record.id);
		}
	});
});

onUnmounted(() => {
	pb.collection('comments').unsubscribe('*');
});

// Start editing a comment
const startEditing = async (comment) => {
	editingCommentId.value = comment.id;
	FormValues.content = comment.content;

	// Wait for next DOM update, then focus on the form
	await nextTick();
	formRef.value?.focus();
};

// Update comment
const updateComment = async () => {
	if (!editingCommentId.value) return;

	try {
		await pb.collection("comments").update(editingCommentId.value, {
			content: FormValues.content,
		});

		// Reset form and focus back on the comment
		FormValues.content = '';
		const commentId = editingCommentId.value;
		editingCommentId.value = null;

		// Wait for next update, then focus on the comment
		await nextTick();
		commentRef.value[commentId]?.focus();
	} catch (error) {
		console.error("Error updating comment:", error);
	}
};

// Submit a new comment
const onSubmit = async () => {
	if (editingCommentId.value) {
		await updateComment();
	} else {
		try {
			await pb.collection("comments").create({
				content: FormValues.content,
				author_id: pb.authStore.record.id,
				hotel_id: hotelId,
			});
			FormValues.content = '';
		} catch (error) {
			console.error("Error submitting comment:", error);
		}
	}
};
</script>

<template>
	<ul class="flex flex-col gap-3">
		<Card v-for="comment in comments" :key="comment.id" ref="commentRef">
			<template #content>
				<p v-html="comment.content"></p>
			</template>
			<template #footer>
				<Button v-if="comment.author_id == pb.authStore.record.id" variant="outlined" @click="startEditing(comment)">Edit</Button>
			</template>
		</Card>

		<Form @submit="onSubmit" class="flex flex-col gap-4 w-56 lg:w-full">
			<div class="p-card !w-full">
				<Editor v-model="FormValues.content" editorStyle="height: 320px" class="!w-full" ref="formRef" />
			</div>
			<Button type="submit" :label="editingCommentId ? 'Update' : 'Submit'" severity="secondary" />
		</Form>
	</ul>
</template>
