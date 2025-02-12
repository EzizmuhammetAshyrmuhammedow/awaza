import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import tm from "./locales/tm.json";

function loadLocaleMessages() {
	const locales = [{ en: en }, { tm: tm }];
	const messages = {};
	locales.forEach((lang) => {
		const key = Object.keys(lang);
		messages[key] = lang[key];
	});
	return messages;
}
export default createI18n({
	locale: "en",
	fallbackLocale: "en",
	legacy: false,
	messages: loadLocaleMessages(),
});
