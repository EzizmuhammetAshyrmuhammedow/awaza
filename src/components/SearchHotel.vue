<script setup lang="ts">
import { computed, ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { InputIcon, IconField, InputNumber, Card, Popover, DatePicker } from 'primevue'
import { useRouter } from 'vue-router'

// Data

const router = useRouter();

const destination = ref('')
const checkIn = ref(null);
const checkOut = ref(null);
const guests = ref(1);
const rooms = ref(1);
const children = ref(0);
const isGuestOpen = ref(false);
const recentSearches = ref(['Istanbul', 'Ashgabat']);

const today = new Date(); // Today's date
const minCheckOutDate = computed(() => checkIn.value ? new Date(checkIn.value) : today);

// Toggle guests popover
const toggle = (event) => {
	isGuestOpen.value.toggle(event)
}
function search() {
	const queryParams = {
		checkIn: checkIn.value || '', // Fallback to empty string if null
		checkOut: checkOut.value || '', // Fallback to empty string if null
		guests: guests.value || 1, // Fallback to 1 if null
		rooms: guests.value || 1, // Fallback to 1 if null
	};

	router.push({
		name: 'Search',
		query: queryParams,
	});
}
</script>

<template>
	<div class="bg-zinc-800 search-bar flex items-center border rounded-lg overflow-hidden shadow-md p-2 max-w-[1200px] relative">
		<div class="flex items-center border-r px-3">
			<DatePicker
				v-model="checkIn"
				placeholder="Check-in"
				showIcon
				dateFormat="dd/mm/yy"
				:minDate="today"
			class="w-full ml-2 border-none"
			/>
		</div>

		<!-- Check-out -->
		<div class="flex items-center border-r px-3">
			<DatePicker
				v-model="checkOut"
				placeholder="Check-out"
				showIcon
				dateFormat="dd/mm/yy"
				:minDate="minCheckOutDate"
			class="w-full ml-2 border-none"
			/>
		</div>

		<Divider layout="vertical" class="!h-10 !m-0" />

		<!-- Guests & Rooms -->
		<div class="flex items-center border-r px-3 w-1/4 mr-2">
			<Button variant="text" class="!w-full flex flex-row !p-0.5" @click="toggle">
				<i class="pi pi-users"></i>
				<div class="flex flex-col">
					<sup class="text-xs">Guests and Rooms</sup>
					<p class="m-0">{{ guests + children }} Guests, {{ rooms }} Rooms</p>
				</div>
			</Button>

			<!-- Card for Guests & Rooms positioned under the button -->
			<Popover ref="isGuestOpen">
				<Card>
					<template #content>
						<main class="flex flex-col gap-3">
							<div class="flex flex-row items-center gap-10">
								<label for="adult_number">Adults</label>
								<InputNumber
									v-model="guests"
									inputId="adult_number"
									showButtons
									buttonLayout="horizontal"
									:step="1"
									fluid
								>
									<template #incrementbuttonicon>
										<span class="pi pi-plus" />
									</template>
									<template #decrementbuttonicon>
										<span class="pi pi-minus" />
									</template>
								</InputNumber>
							</div>
							<div class="flex flex-row items-center gap-10">
								<label for="child_number" class="mr-[-18px]">Children</label>
								<InputNumber
									v-model="children"
									inputId="child_number"
									showButtons
									buttonLayout="horizontal"
									:step="1"
									fluid
								>
									<template #incrementbuttonicon>
										<span class="pi pi-plus" />
									</template>
									<template #decrementbuttonicon>
										<span class="pi pi-minus" />
									</template>
								</InputNumber>
							</div>
							<div class="flex flex-row items-center gap-10">
								<label for="rooms_number" class="mr-[-6px]">Rooms</label>
								<InputNumber
									v-model="rooms"
									class=""
									inputId="rooms_number"
									showButtons
									buttonLayout="horizontal"
									:step="1"
									fluid
								>
									<template #incrementbuttonicon>
										<span class="pi pi-plus" />
									</template>
									<template #decrementbuttonicon>
										<span class="pi pi-minus" />
									</template>
								</InputNumber>
							</div>
						</main>
					</template>
				</Card>
			</Popover>
		</div>

		<!-- Search Button -->
		<Button label="Search" class="w-1/6 ml-2" @click="search" />
	</div>
</template>
