import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'
import { ref } from 'vue'

const pb = new PocketBase('http://127.0.0.1:8090') // Replace with your PocketBase URL

export const useAuthStore = defineStore('auth', () => {
	const isAuthenticated = ref(false) // Reactive state to track authentication status
	const isAdmin = ref(false)

	const checkAuth = () => {
		isAuthenticated.value = pb.authStore.isValid // Update local state based on auth store
	}
	const checkAdmin = () => {
		if (pb.authStore.record.role === 'Admin') {
			isAdmin.value = true
		}
		isAdmin.value = false
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

	const register = async (username, email, password) => {
		try {
			await pb.collection('users').create({
				name: username,
				email,
				password,
				passwordConfirm: password,
				emailVisibility: true
			})

			await login(email, password) // Automatically log in after registration
			checkAuth() // Update authentication status
		} catch (error) {
			console.error('Registration failed:', error)
			throw error // Rethrow error for handling in component
		}
	}

	checkAuth() // Initial check for authentication status on store creation

	return { isAuthenticated, isAdmin, checkAuth, checkAdmin, login, logout, register }
})
