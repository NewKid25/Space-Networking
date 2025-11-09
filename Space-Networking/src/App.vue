<script setup lang="ts">

import test from "./components/test.vue"
import Renderer from "./components/Renderer.vue";
import Simulation from "./components/Simulation.vue";
import { SimpleLineScenario, TestDataScenario } from "./lib/simulator/scenarios/index";


import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import About from "./components/About.vue";
import ScenariosTab from "./components/ScenariosTab.vue";


</script>

<template>

  <div id="header">
    <h1>Packets in space</h1>
  </div>
  <Tabs value="1">
    <TabList>
      <Tab value="0">Learn</Tab>
      <Tab value="1">Explore</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <About></About>
      </TabPanel>
      <TabPanel value="1">
        <ScenariosTab></ScenariosTab>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

