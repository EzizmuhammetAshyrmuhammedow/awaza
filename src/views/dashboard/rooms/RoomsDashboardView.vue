<template>
	<div class="card">
		<div class="flex justify-end mb-2">
			<InputText v-model="filters.global.value" :placeholder="$t('global_search')" />
		</div>
		<Button :label="$t('create_new_room')" @click="createDialog = !createDialog"/>
		<RouterLink :to="'/hotels/' + hotelId + '/rooms'">{{$t('room_type', 5)}}</RouterLink>
		<DataTable :value="rooms" :filters="filters" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
			<template #header>
				<span class="text-xl font-medium">{{ $t('room', 5) }}</span>
			</template>
			<Column field="id" header="ID" class="w-1/4" sortable="true"/>
			<Column field="expand.room_type.room_type" :header="$t('room_type')" style="width: 25%" sortable="true"></Column>
			<Column field="available" :header="$t('availability')" style="width: 25%" sortable="true"></Column>
			<Column :header="$t('image')" style="width: 25%" sortable="true">
				<template #body="slotProps">
					<img v-if="slotProps.data.thumbnail" :src="pb.files.getURL(slotProps.data, slotProps.data.thumbnail)" class="w-24 rounded" />
				</template>
			</Column>
			<Column :header="$t('actions')">
				<template #body="{ data }">
					<Button severity="warn" icon="pi pi-pencil" class="p-button-rounded" @click="openEditModal(data)" />
				</template>
			</Column>
		</DataTable>
		<Dialog v-model:visible="editDialog" header="Edit Room" :modal="true">
			<div class="p-fluid flex flex-col gap-5 w-96">
				<label for="room_type">Room Type</label>
				<InputText id="room_type" v-model="editedData.room_type" />

				<label for="available">Room Availability</label>
				<InputText id="available" v-model="editedData.available" />

				<label for="thumbnail">Room Image</label>
				<FileUpload mode="basic" name="thumbnail" accept="image/*" :auto="false" @select="handleEditFileUpload" />

				<div v-if="editedData.thumbnail" class="mt-3">
					<p>Current Image:</p>
					<img :src="pb.files.getURL(selectedRoom, selectedRoom.thumbnail)" class="w-24 rounded" />
				</div>

				<div class="flex justify-end mt-3">
					<Button label="Cancel" class="p-button-text" @click="editDialog = false" />
					<Button label="Save" class="p-button-success ml-2" @click="updateRoom" />
				</div>
			</div>
		</Dialog>

		<Dialog v-model:visible="createDialog" :header="$t('create_room')" :modal="true">
			<div class="p-fluid flex flex-col gap-5 w-96">
				<label for="room_id">{{ $t('room') }} ID</label>
				<InputText id="room_id" v-model="createdData.id" :placeholder="$t('room_id_pattern')"/>

				<label for="room_type">{{ $t('room_type') }}</label>
				<Select
					:options="RoomTypeOptions"
					id="room_type"
					v-model="createdData.room_type"
					label="label"
				/>


				<label for="available">{{ $t('availability') }}</label>
				<InputText id="available" v-model="createdData.available"/>

				<label for="thumbnail">{{ $t('room_image') }}</label>
				<FileUpload mode="basic" name="thumbnail" accept="image/*" :auto="false" @select="handleFileUpload" />

				<div class="flex justify-end mt-3">
					<Button label="Cancel" class="p-button-text" @click="createDialog = false" />
					<Button label="Save" class="p-button-success ml-2" @click="createRoom" />
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DataTable, Column, Dialog, Button, FileUpload, Select } from 'primevue'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../../pocketbase-types.ts'
import InputText from 'primevue/inputtext'

const filters = ref({
	global: { value: null, matchMode: 'contains' }
});

const RoomTypeOptions = [
	'VIP',
	'Standard',
	'Double',
	'VIP ULTRA LUXE',
	'VIP Deluxe',
]

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

const rooms = ref();
const userId = pb.authStore.record.id;
const hotel = ref();
const hotelId = ref('')
const editFile = ref<File | null>(null);
const selectedRoom = ref(null);
const editDialog = ref(false);
const createDialog = ref(false);

const editedData = ref({
	room_type: "",
	available: false,
	thumbnail: "",
});
const selectedFile = ref<File | null>(null);
const createdData = ref({
	hotel_id: hotelId,
	id: '',
	room_type: '',
	available: false,
});

function openEditModal(employee) {
	selectedRoom.value = employee;
	editedData.value = { ...employee }; // Clone the object
	editDialog.value = true;
}

function handleFileUpload(event: any) {
	const file = event.files?.[0];
	if (file) {
		selectedFile.value = file;
	}
}
function handleEditFileUpload(event: any) {
	const file = event.files?.[0];
	if (file) {
		editFile.value = file;
	}
}

async function createRoom() {
	try {
		const formData = new FormData();
		formData.append("hotel", createdData.value.hotel_id)
		formData.append("id", createdData.value.id);
		formData.append("room_type", createdData.value.room_type.replace(/\s+/g, '').toLowerCase());
		formData.append("available", createdData.value.available.toString());

		if (selectedFile.value) {
			formData.append("thumbnail", selectedFile.value);
		}

		await pb.collection("rooms").create(formData);
		createDialog.value = false;
		createdData.value.id = ''
		createdData.value.room_type = ''
		createdData.value.available = false
		console.log(formData)
	} catch (error) {
		console.error("Error creating room:", error);
	}
}

async function updateRoom() {
	if (!selectedRoom.value) return;

	try {
		const formData = new FormData();
		formData.append("room_type", editedData.value.room_type);
		formData.append("available", editedData.value.available.toString());

		if (editFile.value) {
			formData.append("thumbnail", editFile.value);
		}

		await pb.collection("rooms").update(selectedRoom.value.id, formData);
		editDialog.value = false;
		await getRooms();
	} catch (error) {
		console.error("Error updating room:", error);
	}
}

async function getHotelId() {
	try {
		hotel.value = await pb.collection('hotels').getFirstListItem(`owner_id = "${userId}"`);
		hotelId.value = hotel.value?.id || null;
	} catch (error) {
		console.error("Failed to fetch hotel:", error);
		hotel.value = null;
		hotelId.value = null;
	}
}
async function getRooms(){
	const record = await pb.collection('rooms').getFullList( {
		filter: `hotel.id = "${hotelId.value}"`,
		expand: 'room_type',
	})
	rooms.value = record
	console.log(rooms.value)
}

const customers = ref();

onMounted(async () => {
	await getHotelId()
	await getRooms()
	pb.collection('rooms').subscribe('*', async (e) => {
		if (e.action === 'create' || e.action === 'delete' || e.action === 'update') {
			await getHotelId()
			await getRooms()
		}
	})
})
</script>
