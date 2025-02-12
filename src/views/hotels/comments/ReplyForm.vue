// ReplyForm.vue
<template>
	<div class="flex flex-col gap-3">
		<Textarea v-model="replyText" :placeholder="t('write_a_reply')"></Textarea>
		<Button @click="submitReply">{{ $t('submit_reply') }}</Button>
	</div>
</template>

<script setup lang="ts">
import { Textarea, Button } from 'primevue'
import { ref } from 'vue';
import PocketBase from 'pocketbase';
import { TypedPocketBase } from '../../../../pocketbase-types.js'
import { useAuthStore } from '@/stores/auth.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
	parentId: {  // Renamed from commentId to parentId for clarity
		type: String,
		required: true,
	},
	hotel_id: String,
});

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const replyText = ref('');
const authStore = useAuthStore()
const userId = pb.authStore.record.id
const emit = defineEmits(['reply-added']); // Define the event

const submitReply = async () => {
	try {
		const record = await pb.collection('comments').create({ // Creating a *comment*, not a 'reply'
			author_id: userId,
			content: replyText.value,
			parent_id: props.parentId, // Set the parent_id
			hotel_id: props.hotel_id,
			read: false
		});
		replyText.value = ''; // Clear the input
		emit('reply-added'); // Notify the parent
	} catch (error) {
		console.error('Error creating reply:', error);
		// Handle the error (e.g., show an error message)
	}
};
</script>
