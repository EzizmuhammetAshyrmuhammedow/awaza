<script setup lang="ts">
import PocketBase from 'pocketbase'

import { TypedPocketBase } from '../../../../pocketbase-types.ts'

import { onMounted, reactive, onUnmounted, h, nextTick, ref, computed } from 'vue'

import { useRoute } from 'vue-router'

import {
	Button,
	Card,
	FloatLabel,
	InputNumber,
	Tab,
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
} from 'primevue'

import { Form } from '@primevue/forms'

import Editor from 'primevue/editor'

import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth.ts'

import Toast from 'primevue/toast'

import CommentItem from '@/views/hotels/comments/CommentItem.vue'

import { useToast } from 'primevue/usetoast'

const { t } = useI18n()

const toast = useToast()

const pb = new PocketBase('http://localhost:8090') as TypedPocketBase

const activeTab = ref(0)

const authStore = useAuthStore()

const route = useRoute()

const hotelId = route.path.split('/')[2]

const comments = ref<
	Record<
		string,
		{
			id: string
			content: string
			like_count: number
			dislike_count: number
			read: boolean
			author: any
			isLiked: boolean
			isDisliked: boolean
		}
	>
>([])
const reviews = ref()

const editingCommentId = ref(null)

const editingComment = ref(false)

const formRef = ref(null)

const commentRefs = ref({}) // Stores references for comments

const ratings = reactive({
	FoodRating: 0,

	ServiceRating: 0,

	RoomRating: 0,

	EntertainmentRating: 0,
})

const totalRating = computed(() => {
	return (
		(ratings.FoodRating +
			ratings.ServiceRating +
			ratings.RoomRating +
			ratings.EntertainmentRating) /
		4
	)
})
async function getComents () {
	comments.value = await pb.collection('comments').getFullList({
		filter: `hotel_id = "${hotelId}" && overall_rating = 0`,
	})
}

async function getReviews () {
	reviews.value = await pb.collection('comments').getFullList({
		filter: `hotel_id = "${hotelId}" && overall_rating != 0`,
	})
}

const FormValues = reactive({ content: '' })

onMounted(async () => {
	await getComents()
	await getReviews()

	await pb.collection('comments').subscribe('*', (e) => {
		if (e.action === 'create' && e.record.hotel_id === hotelId) {
			getComents()
			getReviews()
		} else if (e.action === 'update') {
			getComents()
			getReviews()
		} else if (e.action === 'delete') {
			getComents()
			getReviews()
		}
	})
})

onUnmounted(() => {
	pb.collection('comments').unsubscribe('*')
})

// Scroll helper function

const scrollToElement = (el) => {
	if (el) {
		el.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}
}

// Start editing a comment

const startEditing = async (comment) => {
	editingComment.value = true

	editingCommentId.value = comment.id

	FormValues.content = comment.content

	await nextTick()

	if (formRef.value) {
		// Check if $el exists and has focus method

		if (formRef.value.$el && typeof formRef.value.$el.focus === 'function') {
			scrollToElement(formRef.value.$el)

			formRef.value.$el.focus()
		} else {
			console.error('Editor element does not have focus method or $el is not available.')
		}
	} else {
		console.error('formRef is not properly referencing the Editor component.')
	}
}

// Update comment

const updateComment = async () => {
	if (!editingCommentId.value) return

	try {
		await pb.collection('comments').update(editingCommentId.value, {
			content: FormValues.content,
		})

		// Reset form

		FormValues.content = ''

		const commentId = editingCommentId.value

		editingCommentId.value = null

		editingComment.value = false

		await nextTick()

		scrollToElement(commentRefs.value[commentId]?.$el) // Scroll back to comment
	} catch (error) {
		console.error('Error updating comment:', error)
	}
}

// Submit new comment or update existing one

const onSubmit = async () => {
	if (editingComment.value) {
		await updateComment()
	} else {
		try {
			await pb.collection('comments').create({
				content: FormValues.content,

				author_id: pb.authStore.record.id,

				hotel_id: hotelId,

				food_rating: ratings.FoodRating,

				service_rating: ratings.ServiceRating,

				room_rating: ratings.RoomRating,

				entertainment_rating: ratings.EntertainmentRating,

				overall_rating: totalRating.value,
			})

			FormValues.content = ''

			ratings.FoodRating = 0

			ratings.ServiceRating = 0

			ratings.RoomRating = 0

			ratings.EntertainmentRating = 0

			toast.add({
				severity: 'success',

				summary: 'Review posted successfully.',

				life: 3000,

				closable: true,
			})
		} catch (error) {
			console.error('Error submitting comment:', error)
		}
	}
}

const cancelEditing = () => {
	editingComment.value = false

	FormValues.content = ''
}

async function markAsRead(commentId: string) {
	const comment = await pb.collection('comments').getOne(commentId)

	comment.read = true

	await pb.collection('comments').update(commentId, comment)
}
</script>

<template>
	<Toast />

	<ul class="flex flex-col gap-3">
		<Form @submit="onSubmit" class="flex flex-col gap-4 w-56 lg:w-full">
			<div class="flex flex-row gap-5 mb-3">
				<FloatLabel variant="on">
					<InputNumber id="food-review" v-model="ratings.FoodRating" />

					<label for="food-review">Food Rating</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<InputNumber id="service-review" v-model="ratings.ServiceRating" />

					<label for="service-review">Service Rating</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<InputNumber id="room-review" v-model="ratings.RoomRating" />

					<label for="room-review">Room Rating</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<InputNumber id="entertainment-review" v-model="ratings.EntertainmentRating" />

					<label for="entertainment-review">Entertainment Rating</label>
				</FloatLabel>
			</div>

			<h3>Overall Rating: {{ totalRating }}</h3>

			<div class="p-card !w-full">
				<Editor
					v-model="FormValues.content"
					editorStyle="height: 320px"
					class="!w-full"
					ref="formRef"
				/>
			</div>

			<Button
				type="submit"
				:label="editingComment ? t('update') : t('submit')"
				severity="secondary"
			/>

			<Button
				v-if="editingComment"
				variant="outlined"
				severity="danger"
				:label="t('cancel')"
				@click="cancelEditing"
			/>
		</Form>

		<Tabs value="0">
			<TabList>
				<Tab value="0">Comments</Tab>

				<Tab value="1">Reviews</Tab>
			</TabList>

			<TabPanels class="!bg-transparent">
				<TabPanel value="0" class="!bg-transparent">
					<div class="flex flex-col gap-3 ">
					<CommentItem
						v-for="comment in comments"
						:key="comment.id"
						:comment="comment"
						:hotel-id="hotelId"
						:editingComment="editingComment"
						:editingCommentId="editingCommentId"
						:FormValues="FormValues"
						:startEditing="startEditing"
						:cancelEditing="cancelEditing"
						:markAsRead="markAsRead"
					/>
					</div>
				</TabPanel>

				<TabPanel value="1" class="!bg-transparent">
					<div class="flex flex-col gap-3 ">
						<CommentItem
							v-for="comment in reviews"
							:key="comment.id"
							:comment="comment"
							:hotel-id="hotelId"
							:editingComment="editingComment"
							:editingCommentId="editingCommentId"
							:FormValues="FormValues"
							:startEditing="startEditing"
							:cancelEditing="cancelEditing"
							:markAsRead="markAsRead"
						/>
					</div>

				</TabPanel>
			</TabPanels>
		</Tabs>
	</ul>
</template>
