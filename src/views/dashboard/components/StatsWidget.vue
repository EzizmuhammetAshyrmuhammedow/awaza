<template>
	<div class="col-span-12 lg:col-span-6 xl:col-span-3">
		<div class="p-card mb-0 p-3">
			<div class="flex justify-between mb-4">
				<div>
					<span class="block opacity-60 font-medium mb-4">Orders</span>
					<div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
				</div>
				<div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-lg" style="width: 2.5rem; height: 2.5rem">
					<i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
				</div>
			</div>
			<span class="text-primary font-medium">24 new </span>
			<span class="opacity-60">since last visit</span>
		</div>
	</div>
	<div class="col-span-12 lg:col-span-6 xl:col-span-3">
		<div class="p-card mb-0 p-3">
			<div class="flex justify-between mb-4">
				<div>
					<span class="block opacity-60 font-medium mb-4">Revenue</span>
					<div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
				</div>
				<div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-lg" style="width: 2.5rem; height: 2.5rem">
					<i class="pi pi-dollar text-orange-500 !text-xl"></i>
				</div>
			</div>
			<span class="text-primary font-medium">%52+ </span>
			<span class="opacity-60">since last week</span>
		</div>
	</div>
	<div class="col-span-12 lg:col-span-6 xl:col-span-3">
		<div class="p-card mb-0 p-3">
			<div class="flex justify-between mb-4">
				<div>
					<span class="block opacity-60 font-medium mb-4">Customers</span>
					<div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
				</div>
				<div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-lg" style="width: 2.5rem; height: 2.5rem">
					<i class="pi pi-users text-cyan-500 !text-xl"></i>
				</div>
			</div>
			<span class="text-primary font-medium">520 </span>
			<span class="opacity-60">newly registered</span>
		</div>
	</div>
	<div class="col-span-12 lg:col-span-6 xl:col-span-3">
		<div class="p-card mb-0 p-3">
			<div class="flex justify-between mb-4">
				<div>
					<RouterLink :to="'hotels/' +  hotelId + '/comments'" class="block opacity-60 font-medium mb-4">Comments</RouterLink>
					<div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{totalItems}}</div>
				</div>
				<div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-lg" style="width: 2.5rem; height: 2.5rem">
					<i class="pi pi-comment text-purple-500 !text-xl"></i>
				</div>
			</div>
			<span class="text-primary font-medium">25</span>
			<span class="opacity-60">responded</span>
		</div>
	</div>
</template>
<script setup lang="ts">
import PocketBase from 'pocketbase';
import { ref, onMounted, onUnmounted, watch } from 'vue';

const pb = new PocketBase("http://localhost:8090");

const props = defineProps<{hotelId: string}>();

const totalItems = ref(0);
console.log(props.hotelId);

watch(() => props.hotelId, async (newHotelId) => {
	if (newHotelId) {
		await fetchCommentCount();
	}
});

async function fetchCommentCount() {
	if (!props.hotelId) return;

	try {
		const { totalItems: count } = await pb.collection("comments").getList(1, 1, {
			filter: `hotel_id = "${props.hotelId}"`,
		});
		totalItems.value = count;
	} catch (error) {
		console.error("Error fetching comment count:", error);
	}
}

onMounted(async () => {
	await fetchCommentCount();

	// Subscribe to real-time updates
	pb.collection("comments").subscribe("*", async (e) => {
		if (e.action === "create" || e.action === "delete") {
			await fetchCommentCount();
		}
	});
});

onUnmounted(() => {
	pb.collection("comments").unsubscribe("*");
});
</script>
