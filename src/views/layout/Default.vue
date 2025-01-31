<script setup lang="ts">

import { RouterView } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
</script>

<template>
	<AppBar/>
	<div p2 mt-20>
		<RouterView/>
	</div>
</template>

<style scoped lang="scss">

</style>
