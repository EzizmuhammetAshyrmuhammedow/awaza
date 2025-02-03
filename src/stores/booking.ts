import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookingStore = defineStore('booking', () => {
	// Retrieve the guest_amount from localStorage if it exists
	const guest_amount = ref<number | undefined>(
		localStorage.getItem('guest_amount')
			? JSON.parse(localStorage.getItem('guest_amount')!)
			: undefined,
	)
	const room_amount = ref<number | undefined>(
		localStorage.getItem('room_amount')
			? JSON.parse(localStorage.getItem('room_amount')!)
			: undefined,
	)
	const check_in = ref<number | undefined>(
		localStorage.getItem('check_in')
			? JSON.parse(localStorage.getItem('check_in')!)
			: undefined,
	)
	const check_out = ref<number | undefined>(
		localStorage.getItem('check_out')
			? JSON.parse(localStorage.getItem('check_out')!)
			: undefined,
	)

	// Function to update guest_amount and save it to localStorage
	function setGuestAmount(amount: number) {
		guest_amount.value = amount
		localStorage.setItem('guest_amount', JSON.stringify(amount))
	}

	function setRoomAmount(amount: number) {
		room_amount.value = amount
		localStorage.setItem('room_amount', JSON.stringify(amount))
	}
	function setCheckIn(check_in) {
		check_in.value = check_in
		localStorage.setItem('check_in', JSON.stringify(check_in))
	}
	function setCheckOut(check_out) {
		check_out.value = check_out
		localStorage.setItem('check_in', JSON.stringify(check_out))
	}
	// Function to clear guest_amount from localStorage
	function clearGuest() {
		guest_amount.value = undefined
		localStorage.removeItem('guest_amount')
	}
	function clearRoomAmount() {
		guest_amount.value = undefined
		localStorage.removeItem('room_amount')
	}
	function clearCheckIn() {
		check_in.value = undefined
		localStorage.removeItem('check_in')
	}
	function clearCheckOut() {
		check_out.value = undefined
		localStorage.removeItem('check_out')
	}

	return {
		guest_amount,
		room_amount,
		check_in,
		check_out,
		setGuestAmount,
		setRoomAmount,
		setCheckIn,
		setCheckOut,
		clearGuest,
		clearRoomAmount,
		clearCheckIn,
		clearCheckOut,
	}
})
