<script setup lang="ts">
import { computed, ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { InputIcon, IconField, InputNumber, Card, Popover, DatePicker } from 'primevue'
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
const isGuestOpen = ref<InstanceType<typeof Popover> | null>(null);

const today = new Date();
const minCheckOutDate = computed(() => {
	if (checkIn.value) {
		const nextDay = new Date(checkIn.value);
		nextDay.setDate(nextDay.getDate() + 1);
		return nextDay;
	}
	return today;
});

// For toggling the guest popover, since isGuestOpen is a boolean, simply toggle it:
const toggle = (event) => {
	isGuestOpen.value.toggle(event)
}

function search() {
	const queryParams = {
		checkIn: checkIn.value || '',
		checkOut: checkOut.value || '',
		guests: guests.value || 1,
		children: children.value,
		rooms: rooms.value || 1,
	};

	router.push({
		path: '/search',
		query: queryParams,
	});
	console.log(queryParams);
}
</script>

<template>
	<!-- The outer Card uses flex-col by default for mobile and flex-row on medium+ screens -->
	<Card class="search-bar flex flex-col md:flex-row items-center border rounded-lg overflow-hidden shadow-md p-4 max-w-full relative">
		<template #content>
			<!-- Container for the form inputs -->
			<div class="flex flex-col md:flex-row items-center justify-between w-full">
				<!-- Grouped inputs -->
				<div class="flex flex-col md:flex-row items-center w-full">
					<!-- Check-in date -->
					<div class="w-full md:w-auto flex items-center border-b md:border-r px-3 py-2">
						<DatePicker
							v-model="checkIn"
							:placeholder="t('check_in')"
							showIcon
							dateFormat="dd/mm/yy"
							:minDate="today"
							class="w-full border-none"
						/>
					</div>
					<!-- Check-out date -->
					<div class="w-full md:w-auto flex items-center border-b md:border-r px-3 py-2">
						<DatePicker
							v-model="checkOut"
							:placeholder="t('check_out')"
							showIcon
							dateFormat="dd/mm/yy"
							:minDate="minCheckOutDate"
							class="w-full border-none"
						/>
					</div>
					<!-- Guests & Rooms -->
					<div class="w-full md:w-auto flex items-center border-b md:border-r px-3 py-2">
						<Button
							variant="text"
							class="w-full flex flex-row p-0.5"
							@click="toggle"
						>
							<i class="pi pi-users"></i>
							<div class="flex flex-col">
								<sup class="text-xs">
									{{ $t("guest", 5) }} {{ $t("and") }} {{ $t("room", 5) }}
								</sup>
								<p class="m-0">
									{{ guests + children }} {{ $t("guest", 5) }}, {{ rooms }} {{ $t("room", 5) }}
								</p>
							</div>
						</Button>
						<!-- Guest & Rooms Popover -->
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
				</div>
				<!-- Search Button -->
				<div class="w-full md:w-auto flex justify-center p-2">
					<Button
						:label="t('search')"
						class="w-full md:w-auto"
						@click="search"
						:disabled="!checkIn || !checkOut"
					/>
				</div>
			</div>
		</template>
	</Card>
</template>
