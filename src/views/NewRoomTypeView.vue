<script setup lang="ts">
import PocketBase from 'pocketbase'
import { ref, onMounted, reactive } from 'vue'
import { Card, Button, InputText, FileUpload, InputNumber } from 'primevue'
import Editor from 'primevue/editor';
import { useRouter } from 'vue-router'

const pb = new PocketBase("http://localhost:8090")
const router = useRouter()
const path = window.location.pathname
const hotelId = String(path.split('/')[2])

// Predefined select options for room types
const roomType = reactive({
	id: '', // Initialize as empty string
	type: '', // Initialize as empty string
	price: 0, // Initialize as 0 for price
	capacity: 0, // Initialize as 0 for capacity
	features: '', // Initialize as empty string
	extra_info: '', // Initialize as empty string
})

const price = ref(0) // Price for the room type
const fileInput = ref(null) // File input for thumbnail
const selectedPhotos = ref([]);
const photosUploader = ref(null);

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

// Function to create room
async function createRoom() {
	try {
		const formData = new FormData()
		formData.append('id', roomType.type.replace(/\s+/g, '').toLowerCase())
		console.log(roomType.type.replace(/\s+/g, '').toLowerCase())
		formData.append('room_type', roomType.type)
		formData.append('price', roomType.price.toString())
		formData.append('capacity', roomType.capacity.toString())
		formData.append('features', roomType.features)
		formData.append('extra_info', roomType.extra_info)

		selectedPhotos.value.forEach(newPhoto => {
			formData.append("photos+", newPhoto);
		});

		await pb.collection('room_types').create(formData)
		alert('Room Created Successfully!')
		router.push(`/hotels/${hotelId}/rooms/${roomType.id}`)
	} catch (error) {
		console.error('Error creating room:', error)
		alert('Failed to create room')
	}
}
</script>

<template>
	<div class="max-w-screen-md mx-auto p-6 bg-zinc-9 shadow-lg rounded-lg">
		<h1 class="text-2xl font-bold text-center mb-6">Create Room</h1>

		<!-- Grid Layout for Form -->
		<div class="grid gap-4">
			<!-- Thumbnail Upload -->
			<div class="field">
				<label for="thumbnail" class="font-semibold block mb-1">Thumbnail</label>
				<FileUpload
					mode="advanced"
					accept="image/*"
					:multiple="true"
					:customUpload="true"
					@select="handlePhotosUpload"
					chooseLabel="Upload Photos"
					class="mb-3"
				>
					<template #header="{ chooseCallback }">
						<Button @click="chooseCallback()" icon="pi pi-plus" label="Choose File" />
					</template>
				</FileUpload>
			</div>

			<!-- Room Type -->
			<div class="field">
				<label for="room_type" class="font-semibold block mb-1">Room Type</label>
				<InputText v-model="roomType.type" class="w-full p-2 border rounded-lg" />
			</div>

			<!-- Price & Capacity (Side by Side) -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="price" class="font-semibold block mb-1">Price</label>
					<InputNumber id="price" v-model="roomType.price" class="w-full p-2 border rounded-lg" />
				</div>
				<div>
					<label for="capacity" class="font-semibold block mb-1">Capacity</label>
					<InputNumber id="capacity" v-model="roomType.capacity" class="w-full p-2 border rounded-lg" />
				</div>
			</div>

			<!-- Features -->
			<div>
				<label for="features" class="font-semibold block mb-1">Features</label>
				<Editor id="features" v-model="roomType.features" class="w-full min-h-32 border rounded-lg p-2" />
			</div>

			<!-- Extra Info -->
			<div>
				<label for="extra-info" class="font-semibold block mb-1">Extra Information</label>
				<Editor id="extra-info" v-model="roomType.extra_info" class="w-full min-h-32 border rounded-lg p-2" />
			</div>

			<!-- Submit Button -->
			<div class="text-center mt-4">
				<Button label="Create Room" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600" @click="createRoom" />
			</div>
		</div>
	</div>
</template>
