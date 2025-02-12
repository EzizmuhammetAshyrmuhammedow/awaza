import './assets/main.css'
import 'virtual:uno.css'
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { Chart } from 'chart.js'

// Define locale objects for PrimeVue
const englishLocale = {
	firstDayOfWeek: 0,
	dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	monthNames: [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	],
	monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	today: 'Today',
	clear: 'Clear',
	dateFormat: 'mm/dd/yy',
	weekHeader: 'Wk'
}

const turkmenLocale = {
	firstDayOfWeek: 1,
	dayNames: ['Duşenbe', 'Sişenbe', 'Çarşenbe', 'Penşenbe', 'Anna', 'Şenbe', 'Ýekşenbe'],
	dayNamesShort: ['Du', 'Si', 'Ça', 'Pe', 'An', 'Şe', 'Ýe'],
	dayNamesMin: ['D', 'S', 'Ç', 'P', 'A', 'Ş', 'Ý'],
	monthNames: [
		'Ýanwar', 'Fewral', 'Mart', 'Aprel', 'Maý', 'Iýun',
		'Iýul', 'Awgust', 'Sentýabr', 'Oktýabr', 'Noýabr', 'Dekabr'
	],
	monthNamesShort: ['Ýan', 'Few', 'Mar', 'Apr', 'Maý', 'Iýn', 'Iýl', 'Awg', 'Sen', 'Okt', 'Noý', 'Dek'],
	today: 'Şu gün',
	clear: 'Arassala',
	dateFormat: 'dd/mm/yy',
	weekHeader: 'Hf'
}

// Create the app instance
const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)

// Initialize PrimeVue using the current i18n locale:
// i18n.global.locale is usually a ref; use its .value
const initialLocale = i18n.global.locale.value
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: '.my-app-dark', // Explicitly disable dark mode switching
		},
	},
	locale: initialLocale === 'tk' ? turkmenLocale : englishLocale,
	ripple: true,

});


app.use(i18n)
app.use(ToastService, {})

app.mount('#app')
