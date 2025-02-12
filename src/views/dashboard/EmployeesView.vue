<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { AutoComplete } from 'primevue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../../pocketbase-types.ts'

const pb = new PocketBase('http://localhost:8090') as TypedPocketBase

const filteredUsers = ref([])
const users = ref([])
const employees = ref([])
const selectedUser = ref(null)
const selectedSuperior = ref(null)
const selectedSubordinate = ref(null)
const filters = ref({
	global: { value: null, matchMode: 'contains' },
})

const path = window.location.pathname
const hotelId = path.split('/')[2]

const selectedEmployee = ref(null)
const editDialog = ref(false)
const editedData = ref({
	name: '',
	phone_number: '',
	wage: '',
})

async function getUsers() {
	try {
		users.value = await pb.collection('users').getFullList({
			filter: 'role = "Employee"',
		})

		console.log(users.value)
	} catch (error) {
		console.error('Error fetching users:', error)
	}
}

function searchUsers(event) {
	if (!event.query.trim()) {
		filteredUsers.value = users.value
		console.log(filteredUsers.value)
	} else {
		filteredUsers.value = users.value.filter((user) =>
			user.name.toLowerCase().includes(event.query.toLowerCase()),
		)
		console.log(filteredUsers.value)
	}
}

async function getEmployees() {
	try {
		employees.value = await pb.collection('employees').getFullList({
			filter: `hotel_id = "${hotelId}"`,
			expand: 'subordinate, superior, user',
		})
	} catch (error) {
		console.error('Error fetching employees:', error)
	}
}

watch(selectedEmployee, (newEmployee) => {
	if (newEmployee && newEmployee.user) {
		pb.collection('users')
			.getOne(newEmployee.user)
			.then((user) => {
				selectedUser.value = user
			})
	} else {
		selectedUser.value = null
	}
})

// Open modal and populate form
function openEditModal(employee) {
	selectedEmployee.value = employee
	editedData.value = { ...employee } // Clone the object
	editDialog.value = true
}

// Save changes
async function updateEmployee() {
	if (!selectedEmployee.value) return

	try {
		await pb.collection('employees').update(selectedEmployee.value.id, {
			name: editedData.value.name,
			phone_number: editedData.value.phone_number,
			wage: editedData.value.wage,
			user: selectedUser.value?.id || null, // Link to user
			superior: selectedSuperior.value?.id || null,
			subordinate: selectedSubordinate.value?.id || null,
		})
		editDialog.value = false
		getEmployees() // Refresh employees list
	} catch (error) {
		console.error('Error updating employee:', error)
	}
}

const addDialog = ref(false) // Controls visibility of the Add Employee modal
const newEmployee = ref({
	name: '',
	phone_number: '',
	wage: '',
	hotel_id: hotelId,
	user: null,
	superior: null,
	subordinate: null,
})

async function saveNewEmployee() {
	try {
		await pb.collection('employees').create({
			...newEmployee.value,
			hotel_id: hotelId,
		})
		addDialog.value = false // Close the modal after saving
		getEmployees() // Refresh the employee list
	} catch (error) {
		console.error('Error saving new employee:', error)
	}
}

// Real-time listener
onMounted(async () => {
	await getUsers()
	await getEmployees()

	pb.collection('employees').subscribe('*', (e) => {
		if (e.action === 'update' || e.action === 'create' || e.action === 'delete') {
			getEmployees() // Refresh list on updates
		}
	})
})

onUnmounted(() => {
	pb.collection('employees').unsubscribe('*')
})
</script>

<template>
	<div>
		<div class="flex justify-between mb-2">
			<Button :label="$t('add_employee')" @click="addDialog = true" />
			<InputText v-model="filters.global.value" :placeholder="$t('global_search')" />
		</div>

		<DataTable
			:value="employees"
			:filters="filters"
			:globalFilterFields="[
				'name',
				'phone_number',
				'wage',
				'created',
				'subordinate',
				'superior',
			]"
			tableStyle="min-width: 50rem"
			size="large"
		>
			<template #header>
				<span class="text-xl font-medium">{{ $t('employee', 5) }}</span>
			</template>

			<Column field="name" :header="$t('name')" sortable />
			<Column field="phone_number" :header="$t('phone_number')" sortable />
			<Column field="wage" :header="$t('wage')" sortable />
			<Column field="created" :header="$t('joined')" sortable />
			<Column :header="$t('subordinate')">
				<template #body="{ data }">
					<div v-if="data.subordinate && data.subordinate.length">
						<AutoComplete
							optionLabel="name"
							field="name"
							dropdown
							:suggestions="data.expand.subordinate"
							@complete="getEmployees"
						></AutoComplete>
					</div>
					<div v-else>
						{{ $t('no_subordinate') }}
					</div>
				</template>
			</Column>

			<Column :header="$t('superior')">
				<template #body="{ data }">
					<div>
						{{ data.superior ? data.expand.superior.name : $t('no_superior') }}
					</div>
				</template>
			</Column>
			<Column :header="$t('actions')">
				<template #body="{ data }">
					<Button
						severity="warn"
						icon="pi pi-pencil"
						class="p-button-rounded"
						@click="openEditModal(data)"
					/>
				</template>
			</Column>
		</DataTable>

		<Dialog v-model:visible="addDialog" header="Add Employee" :modal="true">
			<div class="p-fluid flex flex-col gap-5">
				<div class="flex flex-col gap-1">
					<label for="add-name">{{ $t('name') }}</label>
					<InputText id="add-name" v-model="newEmployee.name" />
				</div>
				<div class="flex flex-col gap-1">
					<label for="add-phone">{{ $t('phone_number') }}</label>
					<InputText id="add-phone" v-model="newEmployee.phone_number" />
				</div>
				<div class="flex flex-col gap-1">
					<label for="add-wage">{{ $t('wage') }}</label>
					<InputText id="add-wage" v-model="newEmployee.wage" />
				</div>

				<div class="flex flex-col gap-1">
					<label for="user">{{ $t('linked_user') }}</label>
					<AutoComplete
						v-model="selectedUser"
						:suggestions="filteredUsers"
						@complete="searchUsers"
						optionLabel="name"
						field="name"
						dropdown
					/>
				</div>

				<!-- Superior Selection -->
				<div class="flex flex-col gap-1">
					<label for="superior">{{ $t('superior') }}</label>
					<AutoComplete
						v-model="selectedSuperior"
						:suggestions="employees"
						@complete="getEmployees"
						optionLabel="name"
						field="name"
						dropdown
					/>
				</div>

				<!-- Subordinate Selection -->
				<div class="flex flex-col gap-1">
					<label for="subordinate">{{ $t('subordinate') }}</label>
					<AutoComplete
						v-model="selectedSubordinate"
						:suggestions="employees"
						@complete="getEmployees"
						optionLabel="name"
						field="name"
						dropdown
					/>
				</div>
				<div class="flex justify-end mt-3">
					<Button
						:label="$t('cancel')"
						class="p-button-text"
						@click="addDialog = false"
					/>
					<Button label="Save" class="p-button-success ml-2" @click="saveNewEmployee" />
				</div>
			</div>
		</Dialog>

		<!-- Edit Employee Modal -->
		<Dialog v-model:visible="editDialog" header="Edit Employee" :modal="true">
			<div class="p-fluid flex flex-col gap-5">
				<div class="flex flex-col gap-1">
					<label for="name">{{ $t('name') }}</label>
					<InputText id="name" v-model="editedData.name" />
				</div>

				<div class="flex flex-col gap-1">
					<label for="phone">{{ $t('phone_number') }}</label>
					<InputText id="phone" v-model="editedData.phone_number" />
				</div>

				<div class="flex flex-col gap-1">
					<label for="wage">{{ $t('wage') }}</label>
					<InputText id="wage" v-model="editedData.wage" />
				</div>

				<!-- User Selection -->
				<div class="flex flex-col gap-1">
					<label for="user">{{ $t('linked_user') }}</label>
					<AutoComplete
						v-model="selectedUser"
						:suggestions="filteredUsers"
						@complete="searchUsers"
						optionLabel="name"
						field="name"
						dropdown
					/>
				</div>

				<!-- Superior Selection -->
				<div class="flex flex-col gap-1">
					<label for="superior">{{ $t('superior') }}</label>
					<AutoComplete
						v-model="selectedSuperior"
						:suggestions="employees"
						@complete="getEmployees"
						optionLabel="name"
						field="name"
						dropdown
					/>
				</div>

				<!-- Subordinate Selection -->
				<div class="flex flex-col gap-1">
					<label for="subordinate">{{ $t('subordinate') }}</label>
					<AutoComplete
						v-model="selectedSubordinate"
						:suggestions="employees"
						@complete="getEmployees"
						optionLabel="name"
						field="name"
						dropdown
					/>
				</div>

				<div class="flex justify-end mt-3">
					<Button
						:label="$t('cancel')"
						class="p-button-text"
						@click="editDialog = false"
					/>
					<Button label="Save" class="p-button-success ml-2" @click="updateEmployee" />
				</div>
			</div>
		</Dialog>
	</div>
</template>

<style scoped>
/* Add custom styles here if needed */
</style>
