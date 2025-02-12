<script setup lang="ts">
import { Button, Card } from 'primevue'
import CommentReact from '@/views/hotels/comments/CommentReact.vue'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../../pocketbase-types.ts'
import { ref } from 'vue'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

const reviews = ref()

const getReviews = async () => {
	try {
		reviews.value = await pb.collection('reviews').get()
	}
}
</script>

<template>
	<Card>
		<template #content>
			<p v-html="comment.content"></p>
		</template>
		<template #footer>
			<div class="flex flex-row justify-between">
				<div class="flex flex-row gap-3">
					<Button v-if="comment.author_id === pb.authStore.record.id" variant="outlined" @click="startEditing(comment)">
						{{ $t('edit') }}
					</Button>
					<Button v-if="comment.read !== true && isAdmin" variant="outlined" severity="info" @click="markAsRead(comment.id)">
						{{ $t('mark_as_read') }}
					</Button>
					<Button @click="isReplyOpen = !isReplyOpen"> {{ $t('reply') }}</Button>
				</div>
				<CommentReact :comment="comment" :user="user" @comment-updated="refreshComment" />
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
