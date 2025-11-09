<script setup lang="ts">
import Renderer from './Renderer.vue';

import SpaceBody from '../lib/simulator/definitions/space_body'
import Oribiter from '../lib/simulator/definitions/orbiter'
import KineticSim from '../lib/simulator/kinetic_simulator'
import Position from '../lib/simulator/definitions/position'
import { DISTANCE_FROM_SUN } from '../lib/simulator/constants'

import { onMounted, render, useTemplateRef } from 'vue';

const rendererElement = useTemplateRef("rendererElement")

let sun = new SpaceBody(1, "Sun", [new Position(0, 0)])
let earth = new Oribiter(2, "Earth", 1000000, "Sun", sun, new Position(1000000, 0))
let satellite = new Oribiter(3, "DA MOOOOON", 80000, "Earth", earth, new Position(0, 1080000))

let two_bodies = [sun, earth, satellite]
let kSim = new KineticSim(two_bodies, 1000)
kSim.calculate_all_positions();

onMounted(() => {

	if (rendererElement.value != null) {

		rendererElement.value.spaceBodies = kSim.bodies.map((kBody) => {
			let kPos = kBody.pos[kBody.pos.length - 1];
			
			return {
				pos: {x: kPos?.x ?? 0, y: kPos?.y ?? 0, z: 0},
				name: kBody.name
			}
		});

	}

})



</script>

<template>
	<p>Hello</p>
	<Renderer :initial-space-bodies="[]" ref="rendererElement"> </Renderer>
	<slot> <!-- Other controls go here --> </slot>
</template>