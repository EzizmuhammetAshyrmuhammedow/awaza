<script setup lang="ts">
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../pocketbase-types.ts'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;

const filters = ref({
	global: { value: null, matchMode: 'contains' }
});

const bookings = ref([]);

const userId = pb.authStore.record.id;
const hotel= ref();
const hotelId = ref()
console.log(hotel)

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
const selectedEmployee = ref(null);
const editDialog = ref(false);
const editedData = ref({
	name: '',
	phone_number: '',
	wage: ''
});

const formattedBookings = computed(() => {
	const formatter = new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	});

	return bookings.value.map((booking) => ({
		...booking,
		check_in: booking.check_in ? formatter.format(new Date(booking.check_in)) : "",
		check_out: booking.check_out ? formatter.format(new Date(booking.check_out)) : ""
	}));
});

// Fetch employees
async function getBookings() {
	try {
		bookings.value = await pb.collection("bookings").getFullList({
			expand: "user, hotel",
			filter: `hotel.id = "${hotelId.value}"`
		});
		console.log(bookings.value)
	} catch (error) {
		console.error('Error fetching bookings:', error);
	}
}

// Open modal and populate form
function openEditModal(employee) {
	selectedEmployee.value = employee;
	editedData.value = { ...employee }; // Clone the object
	editDialog.value = true;
}

// Save changes
async function updateEmployee() {
	if (!selectedEmployee.value) return;

	try {
		await pb.collection("employees").update(selectedEmployee.value.id, {
			name: editedData.value.name,
			phone_number: editedData.value.phone_number,
			wage: editedData.value.wage
		});
		editDialog.value = false;
	} catch (error) {
		console.error("Error updating employee:", error);
	}
}

// Real-time listener
onMounted(async () => {
	await getHotelId();
	await getBookings();

	pb.collection("bookings").subscribe("*", (e) => {
		if (e.action === "update" || e.action === "create" || e.action === "delete") {
			getBookings(); // Refresh list on updates
		}
	});
});
onUnmounted(() => {
	pb.collection("bookings").unsubscribe("*");
});
</script>

<template>
		<div>
			<div class="flex justify-end mb-2">
				<InputText v-model="filters.global.value" :placeholder="$t('global_search')" />
			</div>

			<DataTable
				:value="formattedBookings"
				:filters="filters"
				:globalFilterFields="['expand.user.name', 'expand.hotel.name', 'guests', 'check_in', 'check_out']"
				tableStyle="min-width: 50rem"
				size="large"
			>
				<template #header>
					<span class="text-xl font-medium">Bronlar</span>
				</template>
				<Column field="expand.user.name" header="User" sortable />
				<Column field="expand.hotel.name" header="Hotel" sortable />
				<Column field="guests" header="Guests" sortable />
				<Column field="check_in" header="Check In" sortable />
				<Column field="check_out" header="Check Out" sortable />
				<Column header="Actions">
					<template #body="{ data }">
						<Button severity="warn" icon="pi pi-pencil" class="p-button-rounded" @click="openEditModal(data)" />
					</template>
				</Column>
			</DataTable>

			<!-- Edit Employee Modal -->
			<Dialog v-model:visible="editDialog" header="Edit Employee" :modal="true">
				<div class="p-fluid">
					<label for="name">Name</label>
					<InputText id="name" v-model="editedData.name" />

					<label for="phone">Phone Number</label>
					<InputText id="phone" v-model="editedData.phone_number" />

					<label for="wage">Wage</label>
					<InputText id="wage" v-model="editedData.wage" />

					<div class="flex justify-end mt-3">
						<Button label="Cancel" class="p-button-text" @click="editDialog = false" />
						<Button label="Save" class="p-button-success ml-2" @click="updateEmployee" />
					</div>
				</div>
			</Dialog>
		</div>
</template>

<style scoped>

</style>
