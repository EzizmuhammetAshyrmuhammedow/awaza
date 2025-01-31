<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { ref, onMounted, onUnmounted } from 'vue';
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '../../../pocketbase-types.ts';

const pb = new PocketBase("http://localhost:8090") as TypedPocketBase;
const employees = ref([]);
const filters = ref({
	global: { value: null, matchMode: 'contains' }
});

const path = window.location.pathname;
const hotelId = path.split('/')[2];

const selectedEmployee = ref(null);
const editDialog = ref(false);
const editedData = ref({
	name: '',
	phone_number: '',
	wage: ''
});

// Fetch employees
async function getEmployees() {
	try {
		employees.value = await pb.collection("employees").getFullList({
			filter: `hotel_id = "${hotelId}"`
		});
	} catch (error) {
		console.error('Error fetching employees:', error);
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
	await getEmployees();

	pb.collection("employees").subscribe("*", (e) => {
		if (e.action === "update" || e.action === "create" || e.action === "delete") {
			getEmployees(); // Refresh list on updates
		}
	});
});

onUnmounted(() => {
	pb.collection("employees").unsubscribe("*");
});
</script>

<template>
	<div>
		<div class="flex justify-end mb-2">
			<InputText v-model="filters.global.value" placeholder="Global Search" />
		</div>

		<DataTable
			:value="employees"
			:filters="filters"
			:globalFilterFields="['name', 'phone_number', 'wage', 'created']"
			tableStyle="min-width: 50rem"
			size="large"
		>
			<template #header>
				<span class="text-xl font-medium">Employees</span>
			</template>

			<Column field="name" header="Name" sortable />
			<Column field="phone_number" header="Phone Number" sortable />
			<Column field="wage" header="Wage" sortable />
			<Column field="created" header="Joined" sortable />
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
/* Add custom styles here if needed */
</style>
