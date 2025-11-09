<script setup lang="ts">
import Simulation from './Simulation.vue';
import { Select } from 'primevue';
import { ref, useTemplateRef, watch } from 'vue';

import { SimpleLineScenario, TestDataScenario } from '@/lib/simulator/scenarios';

var selection = ref();

const scenarioModules = {
	"Simple Line": SimpleLineScenario
	 }
</script>

<template>
	<select v-model="selection">
		<option value="Simple Line">Simple Line Scenario</option>
		<option value="Test Data">Solar System</option>
	</select>

	<Simulation :setup="SimpleLineScenario" v-if="selection == 'Simple Line'"></Simulation>
	<Simulation :setup="TestDataScenario" v-if="selection == 'Test Data'"></Simulation>


</template>