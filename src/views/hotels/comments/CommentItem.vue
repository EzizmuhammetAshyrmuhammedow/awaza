<template>
	<div class="flex flex-col gap-3">
		<Card ref="commentRefs">
			<template #content>
				<div class="flex flex-row justify-between items-center">
					<p v-html="comment.content"></p>
					<p v-if="comment.overall_rating != 0" @mouseover="isRatingPopoverOpen = true" @mouseleave="isRatingPopoverOpen = false">{{ comment.overall_rating }} <span class="pi pi-star-fill"></span></p>
					<Popover ref="isRatingPopoverOpen">
						<h1>Aha</h1>
					</Popover>
				</div>
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

		<!-- Reply form positioned right below the comment -->
		<div v-if="isReplyOpen" class="ml-10 mt-5">
			<ReplyForm :parentId="comment.id" @reply-added="onReplyAdded" />
		</div>

		<!-- Display Replies (Recursive) -->
		<div v-if="replies.length" class="ml-10 flex flex-col gap-3">
			<CommentItem
				v-for="reply in replies"
				:key="reply.id"
				:comment="reply"
				:editingComment="editingComment"
				:editingCommentId="editingCommentId"
				:FormValues="FormValues"
				:startEditing="startEditing"
				:cancelEditing="cancelEditing"
				:markAsRead="markAsRead"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Card, Button, Popover } from 'primevue'
import { defineProps, ref, onMounted } from 'vue'
import CommentReact from '@/views/hotels/comments/CommentReact.vue'
import { useI18n } from 'vue-i18n'
import PocketBase from 'pocketbase'
import { TypedPocketBase } from '../../../../pocketbase-types.js'
import { useAuthStore } from '@/stores/auth.js'
import { computed, shallowRef } from 'vue';
import ReplyForm from '@/views/hotels/comments/ReplyForm.vue'

const { t } = useI18n();

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const isRatingPopoverOpen = ref<boolean>(false);
const isReplyOpen = ref(false);
const authStore = useAuthStore()
const isAdmin = authStore.isAdmin()
const userId = pb.authStore.record.id
const user = ref()

const props = defineProps({
	comment: {
		type: Object,
		required: true,
	},
	editingComment: Boolean,
	editingCommentId: String,
	FormValues: Object,
	startEditing: Function,
	cancelEditing: Function,
	markAsRead: Function,
});

// Use shallowRef to avoid deep reactivity on the comment object
const comment = shallowRef(props.comment);

const replies = ref([]);

const fetchReplies = async () => {
	try {
		const records = await pb.collection('comments').getList(1, 50, { // Adjust pagination as needed
			filter: `parent_id = "${comment.value.id}"`,
			sort: '+created', // Or '-created' for newest first
		});
		replies.value = records.items;
	} catch (error) {
		console.error('Error fetching replies:', error);
	}
};

const onReplyAdded = () => {
	fetchReplies();
	isReplyOpen.value = false; // Close the reply form
};

const refreshComment = async () => {
	try {
		const record = await pb.collection('comments').getOne(props.comment.id);
		comment.value = record; // Update the comment ref with the new data
	} catch (error) {
		console.error('Error refreshing comment:', error);
	}
};

onMounted(() => {
	fetchReplies();
});
</script>
