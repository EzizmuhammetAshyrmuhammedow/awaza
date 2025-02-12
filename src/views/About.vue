<template>
	<div>
		<h1>{{ $t("welcome") }}</h1>
		<button @click="changeLanguage('en')">English</button>
		<button @click="changeLanguage('tm')">Türkmen</button>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const changeLanguage = (lang) => {
	locale.value = lang;
};
</script>
