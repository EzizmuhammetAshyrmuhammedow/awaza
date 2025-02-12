<template>
	<Card v-if="roomType" class="!h-full w-4/5 mx-auto !shadow-md !shadow-zinc-8 p-2">
		<template #header>
			<div class="flex justify-between">
				<h2 w-full text-center>{{ roomType.capacity }} Adamlyk otag</h2>
				<!-- Admin Edit Button -->
				<Button v-if="isAdmin()" severity="warning" @click="toggleEdit">
					{{ isEditing ? 'Cancel' : 'Edit' }}
				</Button>
			</div>

			<!-- Carousel -->
			<Carousel
				:value="roomType.photos"
				:numVisible="3"
				:numScroll="1"
				:circular="true"
				:autoplayInterval="3000"
				class="custom-carousel"
			>
				<template #item="slotProps">
					<div class="m-5 relative">
						<img
							:src="pb.files.getURL(roomType, slotProps.data)"
							:alt="`Room Photo`"
							class="w-full h-64 object-cover rounded-md"
						/>
						<!-- Delete Photo Button -->
						<Button v-if="isEditing" severity="danger" class="absolute top-2 right-2" @click="deletePhoto(slotProps.data)">
							🗑
						</Button>
					</div>
				</template>
			</Carousel>

			<FileUpload
				v-if="isEditing"
				mode="advanced"
				accept="image/*"
				:multiple="true"
				:customUpload="true"
				@select="handlePhotosUpload"
				chooseLabel="Upload Photos"
				class="mb-3"
			>
				<template #header="{chooseCallback}">
					<Button @click="chooseCallback()" icon="pi pi-plus" label="Choose File"></Button>
				</template>
			</FileUpload>


			<div class="flex flex-row items-center justify-around">
				<h3 class="flex flex-col items-center justify-center">
					{{ $t('price') }}:
					<span v-if="!isEditing" class="text-green-5">{{ roomType.price }}</span>
					<input v-else v-model="roomType.price" type="number" class="border px-2 w-20"/>
				</h3>
				<h3 class="flex flex-col items-center justify-center">
					{{ $t('guest_amount') }}: <span class="text-green-5">{{ roomType.capacity }}</span>
				</h3>
				<h3 class="flex flex-col items-center justify-center">
					{{ $t('room_type') }} : <span class="text-green-5">{{ roomType.room_type }}</span>
				</h3>
			</div>
			<Divider />
		</template>

		<template #content>
			<div class="flex flex-row">
				<div class="flex flex-col">
					<h3 m0 text-green-4>{{ $t('features') }}</h3>
					<p v-if="!isEditing" v-html="roomType.features"></p>
					<Editor v-else v-model="roomType.features" class="border p-2 w-full"></Editor>
				</div>

				<Divider layout="vertical" />

				<div class="flex flex-col">
					<h3 m0 text-green-4>{{ $t('extra_info') }}</h3>
					<p v-if="!isEditing" v-html="roomType.extra_info"></p>
					<Editor v-else v-model="roomType.extra_info" class="border p-2 w-full"></Editor>
				</div>
			</div>

			<!-- Save Changes Button -->
			<Button v-if="isEditing" severity="success" class="mt-2" @click="saveChanges">
				{{ $t('save') }}
			</Button>
		</template>
	</Card>

	<div v-else-if="error">Error loading room details.</div>
	<div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { Card, Carousel, Divider, Button, FileUpload } from 'primevue';
import Editor from 'primevue/editor';
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../pocketbase-types.ts'
import { onMounted, ref } from 'vue'

const pb = new PocketBase('http://localhost:8090') as TypedPocketBase
const roomType = ref(null)
const error = ref(null)
const loading = ref(true)
const isEditing = ref(false)
const selectedPhotos = ref([]);
const photosUploader = ref(null);

const hotel = ref();

const user = pb.authStore.record

function isAdmin() {
	if(user.role === 'admin' && hotel.value.owner_id === `${user?.id}`){
		return true;
	}
	return false;
}

const path = window.location.pathname
const hotelId = String(path.split('/')[2])
const roomTypeId = String(path.split('/')[4])

async function getRoomType() {
	loading.value = true
	error.value = null
	try {
		roomType.value = await pb.collection('room_types').getOne(roomTypeId)
	} catch (err) {
		console.error('Error fetching room type:', err)
		error.value = 'Failed to load room details.'
	} finally {
		loading.value = false
	}
}

const toggleEdit = () => {
	isEditing.value = !isEditing.value
}

const handlePhotosUpload = (event) => {
	console.log("Selected files:", event.files); // Use this to debug what files you receive
	// Instead of merging, just assign the new selection:
	selectedPhotos.value = event.files;

	// If you want to clear the internal state of the FileUpload component,
	// ensure you have bound a ref to it. For example, add ref="photosUploader" in your template:
	if (photosUploader.value) {
		photosUploader.value.clear();
	}
};


async function saveChanges() {
	try {
		const formData = new FormData();

		// Append non-file fields
		formData.append("room_type", roomType.value.room_type);
		formData.append("price", roomType.value.price);
		formData.append("capacity", roomType.value.capacity);
		formData.append("features", roomType.value.features);
		formData.append("extra_info", roomType.value.extra_info);

		// Append new photos using the "photos+" key so they are appended
		selectedPhotos.value.forEach(newPhoto => {
			formData.append("photos+", newPhoto);
		});

		// Update the record (existing photos will be preserved)
		await pb.collection('room_types').update(roomTypeId, formData);

		// Reset editing state and selected photos
		isEditing.value = false;
		selectedPhotos.value = [];
		await getRoomType();
	} catch (err) {
		console.error('Error updating room details:', err);
	}
}


const deletePhoto = async (photoName: string) => {
	try {
		// Update photos array to remove the deleted photo
		roomType.value.photos = roomType.value.photos.filter((p) => p !== photoName);
		await pb.collection('room_types').update(roomTypeId, { photos: roomType.value.photos });
	} catch (err) {
		console.error('Error deleting photo:', err)
	}
}

// Trigger photo upload action
const triggerPhotoUpload = () => {
	if (photosUploader.value) {
		photosUploader.value.clear();
	}
};

onMounted(async () => {
	await getRoomType()
	hotel.value = await pb.collection("hotels").getOne(hotelId)
})
</script>

<style scoped>
/* Your styles here */
.custom-carousel {
	width: 100%;
}
</style>
