<script setup lang="ts">
import { computed, ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { InputNumber, Card, Popover, DatePicker } from 'primevue'
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";

// Data

const router = useRouter();
const { t } = useI18n();

const checkIn = ref(null);
const checkOut = ref(null);
const guests = ref(1);
const rooms = ref(1);
const children = ref(0);
const isGuestOpen = ref(false);

const today = new Date(); // Today's date
const minCheckOutDate = computed(() => {
	if (checkIn.value) {
		const nextDay = new Date(checkIn.value);
		nextDay.setDate(nextDay.getDate() + 1); // Add 1 day to the check-in date
		return nextDay;
	}
	return today; // Fallback to today's date if no check-in date is selected
});

// Toggle guests popover

function search() {
	const queryParams = {
		checkIn: checkIn.value || '', // Fallback to empty string if null
		checkOut: checkOut.value || '', // Fallback to empty string if null
		guests: guests.value || 1, // Fallback to 1 if null
		children: children.value,
		rooms: guests.value || 1, // Fallback to 1 if null
	};

	router.push({
		path: '/search',
		query: queryParams,
	});
	console.log(queryParams);
}
</script>


<template>
	<Card class="search-bar flex items-center border rounded-lg overflow-hidden shadow-md p-2 max-w-[2000px] relative">
		<template #content>
			<div class="flex items-center justify-between p0">
			<div class="flex items-center border-r px-3">
				<DatePicker
					v-model="checkIn"
					:placeholder="t('check_in')"
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
					:placeholder="t('check_out')"
					showIcon
					dateFormat="dd/mm/yy"
					:minDate="minCheckOutDate"
					class="w-full ml-2 border-none"
				/>
			</div>

			<Divider layout="vertical" class="!h-10 !m-0" />

			<!-- Guests & Rooms -->
			<div class="flex items-center border-r px-3 w-1/3 mr-2">
				<Button variant="text" class="!w-full flex flex-row !p-0.5">
					<i class="pi pi-users"></i>
					<div class="flex flex-col">
						<sup class="text-xs">{{ $t("guest", 5) }} {{ $t("and") }} {{ $t("room",5) }}</sup>
						<p class="m-0">{{ guests + children }} {{ $t("guest", 5) }}, {{ rooms }} {{ $t("room",5) }} </p>
					</div>
				</Button>

				<!-- Card for Guests & Rooms positioned under the button -->
				<Popover ref="isGuestOpen">
					<Card>
						<template #content>
							<main class="grid grid-cols-[auto,1fr] gap-4">
								<label for="adult_number">{{ $t("adult", 5) }}</label>
								<div>
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
								<label for="child_number">{{ $t("child", 5) }}</label>
								<div>
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
								<label for="rooms_number">{{ $t("room", 5) }}</label>
								<div>
									<InputNumber
										v-model="rooms"
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
			<Button
				:label="t('search')"
				class="w-1/6 ml-2"
				@click="search"
				:disabled="!checkIn || !checkOut"
			/>
			</div>
		</template>

	</Card>
</template>
