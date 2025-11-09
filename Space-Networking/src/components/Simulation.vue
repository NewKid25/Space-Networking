<script setup lang="ts">
import Renderer from './Renderer.vue';

</script>

<template>
	<Renderer :space-bodies="[]" :packets="[]" :dropped-packets="[]"> </Renderer>
	<slot> <!-- Other controls go here --> </slot>
</template>