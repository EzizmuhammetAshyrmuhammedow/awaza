<script setup lang="ts">
import PocketBase from 'pocketbase';
import { TypedPocketBase } from "../../../pocketbase-types.ts"
import { onMounted, reactive, ref, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Card } from 'primevue';
import { Form } from '@primevue/forms';
import Editor from 'primevue/editor';

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

const route = useRoute();
const hotelId = route.path.split('/')[2];

const comments = ref([]);
const editingCommentId = ref(null);
const editingComment = ref(null);
const formRef = ref(null);
const commentRefs = ref({}); // Stores references for comments

// Form state
const FormValues = reactive({ content: '' });

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

// Scroll helper function
const scrollToElement = (el) => {
	if (el) {
		el.scrollIntoView({ behavior: "smooth", block: "center" });
	}
};

// Start editing a comment
const startEditing = async (comment) => {
	editingComment.value = true;
	editingCommentId.value = comment.id;
	FormValues.content = comment.content;

	await nextTick();
	scrollToElement(formRef.value?.$el); // Scroll to editor
	formRef.value?.focus();
};

// Update comment
const updateComment = async () => {
	if (!editingCommentId.value) return;

	try {
		await pb.collection("comments").update(editingCommentId.value, {
			content: FormValues.content,
		});

		// Reset form
		FormValues.content = '';
		const commentId = editingCommentId.value;
		editingCommentId.value = null;

		await nextTick();
		scrollToElement(commentRefs.value[commentId]?.$el); // Scroll back to comment
	} catch (error) {
		console.error("Error updating comment:", error);
	}
};

// Submit new comment or update existing one
const onSubmit = async () => {
	if (editingComment.value) {
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

const cancelEditing = () => {
	editingComment.value = null;
	FormValues.content = '';
};

async function markAsRead(commentId: string) {
	const comment = await pb.collection('comments').getOne(commentId);
	comment.read = true;
	await pb.collection('comments').update(commentId, comment);
}
</script>

<template>
	<ul class="flex flex-col gap-3">
		<Card v-for="comment in comments" :key="comment.id" ref="commentRefs">
			<template #content>
				<p v-html="comment.content"></p>
			</template>
			<template #footer>
				<Button v-if="comment.author_id == pb.authStore.record.id" variant="outlined" @click="startEditing(comment)">Edit</Button>
				<Button v-if="comment.read != true" variant="outlined" severity="info" @click="markAsRead(comment.id)">Mark As Read</Button>
			</template>
		</Card>

		<Form @submit="onSubmit" class="flex flex-col gap-4 w-56 lg:w-full">
			<div class="p-card !w-full">
				<Editor v-model="FormValues.content" editorStyle="height: 320px" class="!w-full" ref="formRef" />
			</div>
			<Button type="submit" :label="editingComment? 'Update' : 'Submit'" severity="secondary" />
			<Button v-if="editingComment" variant="outlined" severity="danger" label="Cancel" @click="cancelEditing" />
		</Form>
	</ul>
</template>
