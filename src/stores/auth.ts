import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'
import { ref } from 'vue'
import type { TypedPocketBase } from '../../pocketbase-types.ts'

const pb = new PocketBase('http://127.0.0.1:8090') as TypedPocketBase// Replace with your PocketBase URL

export const useAuthStore = defineStore('auth', () => {
	const isAuthenticated = ref(false) // Reactive state to track authentication status
	const user = pb.authStore.record

	const hotel= ref();
	const hotelId = ref()
	async function getHotelId() {
		try {
			hotel.value = await pb.collection('hotels').getFirstListItem(`owner_id = "${user.id}"`);
			hotelId.value = hotel.value?.id || null;
		} catch (error) {
			console.error("Failed to fetch hotel:", error);
			hotel.value = null;
			hotelId.value = null;
		}
	}

	function isAdmin() {
		getHotelId()
		if(user.role === 'Admin' && hotel.value.owner_id === `${user?.id}`){
			return true;
		}
		return false;
	}

	const checkAuth = () => {
		isAuthenticated.value = pb.authStore.isValid // Update local state based on auth store
	}

	const login = async (email, password) => {
		try {
			await pb.collection('users').authWithPassword(email, password)

			isAuthenticated.value = true // Update authentication status
		} catch (error) {
			console.error('Login failed:', error)
			throw error // Rethrow error for handling in component
		}
	}

	const logout = async () => {
		await pb.authStore.clear() // Clear auth store
		isAuthenticated.value = false // Update local state to reflect logout
	}

	const register = async (username, email, password, role) => {
		try {
			// Add the role during user creation
			await pb.collection('users').create({
				name: username,
				email,
				password,
				passwordConfirm: password,
				emailVisibility: true,
				role: role
			})

			await login(email, password) // Automatically log in after registration
			checkAuth() // Update authentication status
		} catch (error) {
			console.error('Registration failed:', error)
			throw error // Rethrow error for handling in component
		}
	}

	checkAuth() // Initial check for authentication status on store creation

	return { isAuthenticated, isAdmin, checkAuth, login, logout, register }
})
