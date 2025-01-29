<script setup lang="ts">

import { RouterView } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
</script>

<template>
	<AppBar class="mb2"/>
	<div p2>
		<RouterView/>
	</div>
</template>

<style scoped lang="scss">

</style>
