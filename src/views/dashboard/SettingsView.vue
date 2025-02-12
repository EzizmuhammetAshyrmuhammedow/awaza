<template>
	<div class="p-4">
		<h1 class="text-2xl font-bold mb-4">Edit Hotel Properties</h1>

		<!-- Hotel Name -->
		<div class="mb-4">
			<label class="block font-medium mb-2">Hotel Name</label>
			<InputText v-model="hotel.name" placeholder="Enter hotel name" class="w-full" />
		</div>

		<!-- Thumbnail Upload -->
		<div class="mb-4">
			<label class="block font-medium mb-2">Thumbnail</label>
			<div class="flex items-center gap-4">
				<!-- Current Thumbnail (if no new file is selected) -->
				<div v-if="hotel.thumbnail && !selectedThumbnail" class="relative">
					<img :src="thumbnailUrl" alt="Thumbnail" class="w-32 h-32 object-cover rounded border" />
					<Button icon="pi pi-trash" class="absolute -top-2 -right-2 p-1" @click="deleteThumbnail" />
				</div>

				<!-- New Thumbnail Preview -->
				<div v-if="selectedThumbnail" class="relative">
					<img :src="newThumbnailUrl" alt="New Thumbnail" class="w-32 h-32 object-cover rounded border" />
					<Button icon="pi pi-trash" class="absolute -top-2 -right-2 p-1" @click="removeNewThumbnail" />
				</div>
			</div>

			<FileUpload
				mode="basic"
				accept="image/*"
				:customUpload="true"
				@select="handleThumbnailUpload"
				chooseLabel="Upload New Thumbnail"
				class="w-full mt-2"
			/>
		</div>

		<!-- Multiple Photos Upload -->
		<div class="mb-4">
			<label class="block font-medium mb-2">Photos</label>
			<FileUpload
				mode="basic"
				accept="image/*"
				:multiple="true"
				:customUpload="true"
				@select="handlePhotosUpload"
				chooseLabel="Upload Photos"
				class="w-full"
			/>

			<!-- Display Existing Photos -->
			<div class="flex flex-wrap gap-2 mt-2">
				<div v-for="(photo, index) in hotel.photos" :key="index" class="relative">
					<img :src="getPhotoUrl(photo)" alt="Hotel Photo" class="w-24 h-24 object-cover rounded border" />
					<Button
						icon="pi pi-trash"
						class="absolute -top-2 -right-2 p-1"
						@click="deletePhoto(photo)"
					/>
				</div>
			</div>
		</div>

		<!-- Save Button -->
		<Button label="Save" icon="pi pi-check" class="mt-4" :loading="loading" @click="saveHotel" />
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import PocketBase from "pocketbase";
import InputText from "primevue/inputtext";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";

const pb = new PocketBase("http://localhost:8090");
const hotelId = "kuwwat"; // Replace with actual hotel ID
const hotel = ref({ name: "", thumbnail: "", photos: [] });
const selectedThumbnail = ref(null);
const selectedPhotos = ref([]);
const loading = ref(false);

// Ref for FileUpload component for photos
const photosUploader = ref(null);

// Fetch hotel details
const fetchHotel = async () => {
	try {
		const record = await pb.collection("hotels").getOne(hotelId);
		hotel.value = record;
	} catch (error) {
		console.error("Error fetching hotel:", error);
	}
};

onMounted(fetchHotel);

// Compute URLs for images
const thumbnailUrl = computed(() =>
	hotel.value.thumbnail ? pb.files.getURL(hotel.value, hotel.value.thumbnail) : ""
);
const newThumbnailUrl = computed(() =>
	selectedThumbnail.value ? URL.createObjectURL(selectedThumbnail.value) : ""
);
const getPhotoUrl = (photo) => pb.files.getURL(hotel.value, photo);

// Handle new thumbnail upload
const handleThumbnailUpload = (event) => {
	const file = event.files[0];
	selectedThumbnail.value = file; // Only one thumbnail allowed
};

// Remove new thumbnail before saving
const removeNewThumbnail = () => {
	selectedThumbnail.value = null;
};

// Delete old thumbnail
const deleteThumbnail = async () => {
	try {
		await pb.collection("hotels").update(hotelId, { thumbnail: null });
		hotel.value.thumbnail = null;
	} catch (error) {
		console.error("Error deleting thumbnail:", error);
	}
};

// Handle multiple photos upload
const handlePhotosUpload = (event) => {
	// Append new files to the existing array
	selectedPhotos.value = [...selectedPhotos.value, ...event.files];

	// Clear the internal file list of the FileUpload component
	if (photosUploader.value) {
		photosUploader.value.clear();
	}
};

// Delete a specific photo
const deletePhoto = async (photo) => {
	try {
		const updatedPhotos = hotel.value.photos.filter((p) => p !== photo);
		await pb.collection("hotels").update(hotelId, { photos: updatedPhotos });
		hotel.value.photos = updatedPhotos;
	} catch (error) {
		console.error("Error deleting photo:", error);
	}
};

// Save hotel data
const saveHotel = async () => {
	try {
		loading.value = true;
		const formData = new FormData();

		formData.append("name", hotel.value.name);

		// Append existing photos as strings
		hotel.value.photos.forEach(existingPhoto => {
			formData.append("photos", existingPhoto);
		});

		// Append new photos as files
		selectedPhotos.value.forEach(newPhoto => {
			formData.append("photos", newPhoto);
		});

		// Handle thumbnail update
		if (selectedThumbnail.value) {
			formData.append("thumbnail", selectedThumbnail.value);
		}

		await pb.collection("hotels").update(hotelId, formData);
		await fetchHotel();

		selectedThumbnail.value = null;
		selectedPhotos.value = [];
	} catch (error) {
		console.error("Error saving hotel:", error);
	} finally {
		loading.value = false;
	}
};

</script>
