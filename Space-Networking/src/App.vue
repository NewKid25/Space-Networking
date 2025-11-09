<script setup lang="ts">

import test from "./components/test.vue"
import Renderer from "./components/Renderer.vue";
import Simulation from "./components/Simulation.vue";
import { SimpleLineScenario, TestDataScenario } from "./lib/simulator/scenarios/index";

</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <Simulation :setup="TestDataScenario"></Simulation>
  <Simulation :setup="SimpleLineScenario"></Simulation>
</template>

<style scoped></style>
