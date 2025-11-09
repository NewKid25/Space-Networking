<script setup lang="ts">
import Simulation from './Simulation.vue';
import { Select } from 'primevue';
import { ref } from 'vue';

import { SimpleLineScenario } from '@/lib/simulator/scenarios';


const selectedSim = ref();
const scenarioModules = [
	{"name": "Simple Line", "value": SimpleLineScenario }
]
</script>

<template>
	<select>
		<option>Simple Line Scenario</option>
		<option>Bingo</option>
	</select>


</template>