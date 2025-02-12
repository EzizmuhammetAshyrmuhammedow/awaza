<script setup lang="ts">
import { Button } from 'primevue'
import { onMounted, ref } from 'vue'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../../pocketbase-types.ts'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

const userId = pb.authStore.record.id
const user = ref()

const isLiked = ref(false);
const isDisliked = ref(false);

const props = defineProps({
	comment: Object,
})

const emit = defineEmits(['comment-updated']); // Define the event

const checkLikeAndDislikeStatus = async () => {
	try {
		user.value = await pb.collection('users').getOne(userId)
		if (user.value.liked_comments.includes(props.comment.id)) {
			isLiked.value = true
		}
		if (user.value.disliked_comments.includes(props.comment.id)) {
			isDisliked.value = true
		}
	} catch (error) {
		console.log(error)
	}
}
onMounted(async () => {
	await checkLikeAndDislikeStatus()
})

async function addLike(comment) {
	try {
		user.value = await pb.collection("users").getOne(userId)
		if (user.value.liked_comments.includes(comment.id)) {
			console.log("Already Liked");
			await unLikeComment(comment);
			isLiked.value = false;
		} else {
			if (isDisliked.value === false) {
				await likeComment(comment);
				isLiked.value = true;
			} else {
				await likeComment(comment);
				isLiked.value = true;
				await unDislikeComment(comment);
				isDisliked.value = false;
			}

		}
		emit('comment-updated'); // Emit the event
	}
	catch (error) {
		console.error("Error updating comment:", error);
	}
}
async function addDislike(comment) {
	try {
		user.value = await pb.collection("users").getOne(userId)
		if (user.value.disliked_comments.includes(comment.id)) {
			console.log("Already DisLiked");
			await unDislikeComment(comment);
			isDisliked.value = false;
		} else {
			if (isLiked.value === false) {
				await dislikeComment(comment);
				isDisliked.value = true;
			} else {
				await dislikeComment(comment);
				isDisliked.value = true;
				await unLikeComment(comment);
				isLiked.value = false;
			}
		}
		emit('comment-updated'); // Emit the event
	}
	catch (error) {
		console.error("Error updating comment:", error);
	}
}

async function likeComment(comment) {
	await pb.collection("users").update(userId, {
		liked_comments: [...user.value.liked_comments, comment.id],
	})
	await pb.collection("comments").update(comment.id, {
		like_count: comment.like_count + 1,
	})
}

async function dislikeComment(comment) {
	await pb.collection("users").update(userId, {
		disliked_comments: [...user.value.disliked_comments, comment.id],
	})
	await pb.collection("comments").update(comment.id, {
		dislike_count: comment.dislike_count + 1,
	})
}

async function unLikeComment(comment) {
	await pb.collection("users").update(userId, {
		liked_comments: user.value.liked_comments.filter(id => id !== comment.id),
	})
	await pb.collection("comments").update(comment.id, {
		like_count: comment.like_count - 1,
	})
}
async function unDislikeComment(comment) {
	await pb.collection("users").update(userId, {
		disliked_comments: user.value.disliked_comments.filter(id => id !== comment.id),
	})
	await pb.collection("comments").update(comment.id, {
		dislike_count: comment.dislike_count - 1,
	})
}
</script>

<template>
	<div class="flex flex-row gap-3">
		<div>
			<Button rounded variant="text" :icon="isLiked ? 'pi pi-thumbs-up-fill' : 'pi pi-thumbs-up'" @click="addLike(comment)" />
			<span>{{ comment.like_count }}</span>
		</div>
		<div>
			<Button rounded variant="text" :icon="isDisliked ? 'pi pi-thumbs-down-fill' : 'pi pi-thumbs-down'" @click="addDislike(comment)" />
			<span>{{ comment.dislike_count }}</span>
		</div>

	</div>
</template>

<style scoped>

</style>
