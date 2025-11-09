<script setup lang="ts">

import test from "./test.vue"
import Renderer from "./Renderer.vue";
import Simulation from "./Simulation.vue";
import { SimpleLineScenario, TestDataScenario } from "../lib/simulator/scenarios/index";


import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';


</script>

<template>

  <h3>Subheading</h3>
  <p>Hello my friend. I am Steve</p>
  <Simulation :setup="TestDataScenario" :elemWidth="'100vw'" :simSec="3500"></Simulation>
  <h3>Simple Line Scenario</h3>
  <p>Imagine, if you will, a line. Now, further, imagine that along that line, there were a number of satellites</p>
  <Simulation :setup="SimpleLineScenario"></Simulation>
</template>

<style scoped></style>
