<template>
	<div class="col-span-12 lg:col-span-6 xl:col-span-3">
		<RoomsCount :hotel-id="hotelId"/>
	</div>
	<div class="col-span-12 lg:col-span-6 xl:col-span-3">
		<div class="p-card mb-0 p-3">
			<div class="flex justify-between mb-4">
				<div>
					<span class="block opacity-60 font-medium mb-4 text-blue-3">Girdeji</span>
					<div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
						50,000 TMT
					</div>
				</div>
				<div
					class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-lg"
					style="width: 2.5rem; height: 2.5rem"
				>
					<i class="pi pi-dollar text-orange-500 !text-xl"></i>
				</div>
			</div>
			<div class="flex gap-1">
				<span class="text-primary font-medium">%52+ </span>
				<span class="opacity-60">köpeliş</span>
			</div>
		</div>
	</div>
	<div class="col-span-12 lg:col-span-6 xl:col-span-3">
		<CustomerCount :hotel-id="hotelId"/>
	</div>
	<div class="col-span-12 lg:col-span-6 xl:col-span-3">
		<div class="p-card mb-0 p-3">
			<div class="flex justify-between mb-4">
				<div>
					<RouterLink
						:to="'hotels/' + hotelId + '/comments'"
						class="block opacity-60 font-medium mb-4 no-underline"
						>{{ $t('comments') }}
					</RouterLink>
					<div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
						{{ totalItems }} {{ $t('comments') }}
					</div>
				</div>
				<div
					class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-lg"
					style="width: 2.5rem; height: 2.5rem"
				>
					<i class="pi pi-comment text-purple-500 !text-xl"></i>
				</div>
			</div>
			<div class="flex gap-1">
				<span class="text-primary font-medium">{{ unreadCommentsCount }}</span>
				<span class="opacity-60">{{ $t('unread') }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import PocketBase from 'pocketbase'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import RoomsCount from '@/views/dashboard/components/Widgets/RoomsCount.vue'
import CustomerCount from '@/views/dashboard/components/Widgets/CustomerCount.vue'

const pb = new PocketBase('http://localhost:8090')

const props = defineProps<{ hotelId: string }>()

const totalItems = ref(0)
const unreadCommentsCount = ref(0) // Track unread comments count as a reactive reference

watch(
	() => props.hotelId,
	async (newHotelId) => {
		if (newHotelId) {
			await fetchCommentCount()
			await getUnreadCommentsCount()
		}
	},
)

// Function to fetch the total number of comments
async function fetchCommentCount() {
	if (!props.hotelId) return

	try {
		const { totalItems: count } = await pb.collection('comments').getList(1, 1, {
			filter: `hotel_id = "${props.hotelId}"`,
		})
		totalItems.value = count
	} catch (error) {
		console.error('Error fetching comment count:', error)
	}
}

// Function to fetch unread comment count
async function getUnreadCommentsCount() {
	if (!props.hotelId) return

	try {
		const unreadComments = await pb.collection('comments').getList(1, 1, {
			filter: `read = false && hotel_id = "${props.hotelId}"`,
		})
		unreadCommentsCount.value = unreadComments.totalItems
	} catch (error) {
		console.error('Error fetching unread comments count:', error)
	}
}

// Subscribe to changes for both total comment count and unread comments count
onMounted(async () => {
	await fetchCommentCount()
	await getUnreadCommentsCount()

	pb.collection('comments').subscribe('*', async (e) => {
		if (e.action === 'create' || e.action === 'delete' || e.action === 'update') {
			await fetchCommentCount()
			await getUnreadCommentsCount()
		}
	})
})

onUnmounted(() => {
	pb.collection('comments').unsubscribe('*')
})
</script>
