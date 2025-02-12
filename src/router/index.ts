import { createRouter, createWebHistory } from 'vue-router'
import About from '@/views/About.vue'
import Index from '@/views/index.vue'
import Login from '@/views/auth/login.vue'
import Signup from '@/views/auth/signup.vue'
import Hotels from '@/views/hotels/hotels.vue'
import HotelId from '@/views/hotels/hotelId.vue'
import Register_admin from '@/views/auth/register_admin.vue'
import Dashboard from '@/views/dashboard/dashboard.vue'
import PocketBase from 'pocketbase'
import Default from '@/views/layout/Default.vue'
import CommentsList from '@/views/hotels/comments/CommentsList.vue'
import EmployeesView from '@/views/dashboard/EmployeesView.vue'
import AnalyticsView from '@/views/dashboard/AnalyticsView.vue'
import SearchView from '@/views/SearchView.vue'
import RoomsView from '@/views/hotels/RoomsView.vue'
import BookHotel from '@/views/BookHotel.vue'
import SettingsView from '@/views/dashboard/SettingsView.vue'
import RoomsDashboardView from '@/views/dashboard/rooms/RoomsDashboardView.vue'
import RoomTypeID from '@/views/RoomTypeID.vue'
import NewRoomTypeView from '@/views/NewRoomTypeView.vue'
import BookingsDashboard from '@/views/dashboard/BookingsDashboard.vue'
import ReviewView from '@/views/hotels/reviews/ReviewView.vue'

const pb = new PocketBase('http://localhost:8090/')

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: Default,
			children: [
				{
					path: '/',
					name: 'home',
					component: Index,
				},
				{
					path: '/about',
					name: 'about',
					component: About,
				},
				{
					path: '/login',
					name: 'login',
					component: Login,
				},
				{
					path: '/signup',
					name: 'signup',
					component: Signup,
				},
				{
					path: '/hotels',
					name: 'hotels',
					component: Hotels,
				},
				{
					path: '/hotels/:id',
					component: HotelId,
				},
				{
					name: 'register admin',
					path: '/register_admin',
					component: Register_admin,
				},
				{
					name: "comments",
					path: "/hotels/:id/comments",
					component: CommentsList,
				},
				{
					name: "reviews",
					path: "/hotels/:id/reviews/",
					component: ReviewView,
				},
				{
					name: "rooms",
					path: "/hotels/:id/rooms",
					component: RoomsView,
				},
				{
					name: "new room",
					path: "/hotels/:id/rooms/new",
					component: NewRoomTypeView,
				},
				{
					name: "roomType",
					path: "/hotels/:id/rooms/:roomId",
					component: RoomTypeID,
				},
				{
					name: "book",
					path: "/hotels/:id/book",
					component: BookHotel,
				},
				{
					path: '/search',
					name: 'Search',
					component: SearchView,
					props: (route) => ({
						checkIn: route.query.checkIn,
						checkOut: route.query.checkOut,
						guests: route.query.guests,
						children: route.query.children,
						rooms: route.query.rooms,
					}),
				},
				{
					path: '/dashboard',
					name: 'Dashboard',
					component: Dashboard,
					beforeEnter: (to, from, next) => {
						const user = pb.authStore.record // Assuming you have PocketBase set up

						if (!pb.authStore.isValid || (user.role !== 'Admin')) {
							next({ name: 'login' }, alert('You are not a verified user or logged in'))
						} else {
							next() // Allow access
						}
					},
					children: [
						{
							path: "/hotels/:id/employees",
							name: "employees",
							component: EmployeesView,
						},
						{
							path: "",
							name: "Analytics",
							component: AnalyticsView,
						},
						{
							path: "/dashboard/settings",
							name: "Settings",
							component: SettingsView,
						},
						{
							path: "/dashboard/rooms",
							name: "Rooms",
							component: RoomsDashboardView,
						},
						{
							path: "/dashboard/bookings",
							name: "Bookings",
							component: BookingsDashboard,
						}
					]
				}
			],
		},
	],
})

export default router
