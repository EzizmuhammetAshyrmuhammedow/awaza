import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import tm from "./locales/tm.json";
import ru from "./locales/ru.json";

// Define a type for the messages
type LocaleMessages = Record<string, string>;

function loadLocaleMessages() {
	const locales = [{ en: en }, { tm: tm }, { ru: ru }];
	const messages: Record<string, LocaleMessages> = {}; // Specify the type

	locales.forEach((lang) => {
		const key = Object.keys(lang)[0]; // Get the first key (e.g., "en", "tm", "ru")
		messages[key] = lang[key]; // Assign the value based on the key
	});

	return messages;
}

export default createI18n({
	locale: "tm",
	fallbackLocale: "tm",
	legacy: false,
	messages: loadLocaleMessages(),
});
