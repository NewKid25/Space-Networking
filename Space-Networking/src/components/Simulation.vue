<script setup lang="ts">
import Renderer from './Renderer.vue';

import SpaceBody from '../lib/simulator/definitions/space_body'
import Orbiter from '../lib/simulator/definitions/orbiter'
import KineticSim from '../lib/simulator/kinetic_simulator'
import Position from '../lib/simulator/definitions/position'
import { DISTANCE_FROM_SUN } from '../lib/simulator/constants'
import Simulator_Engine from '@/lib/simulator/simulator_engine';

import { onMounted, render, useTemplateRef } from 'vue';

const SIM_SECONDS_PER_FRAME = 100;

const rendererElement = useTemplateRef("rendererElement")

let sun = new SpaceBody(1, "Sun", [new Position(0, 0)])
let earth = new Orbiter(2, "Earth", 200000, "Sun", sun)
let satellite = new Orbiter(3, "DA MOOOOON", 50000, "Earth", earth)

let two_bodies = [sun, earth, satellite]
// let kSim = new KineticSim(two_bodies, 100000)
// kSim.calculate_all_positions();
let engine = new Simulator_Engine(two_bodies, 100000)
engine.calculate_all_positions();


let currentTime = 0;

onMounted(() => {

	setInterval(() => {
		if (rendererElement.value != null) {

			rendererElement.value.spaceBodies = engine.bodies.map((kBody) => {
				let kPos = kBody.pos[currentTime];
				
				return {
					pos: {x: kPos?.x ?? 0, y: kPos?.y ?? 0, z: 0},
					name: kBody.name
				}
			});

			if (currentTime < 1000000) {
				currentTime += SIM_SECONDS_PER_FRAME;
			}

			rendererElement.value.renderFrame();
		}
	}, 100);

	

})



</script>

<template>
	<p>Hello</p>
	<Renderer :initial-space-bodies="[]" ref="rendererElement"> </Renderer>
	<slot> <!-- Other controls go here --> </slot>
</template>