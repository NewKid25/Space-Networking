<script setup lang="ts">
import Renderer from './Renderer.vue';

import SpaceBody from '../lib/simulator/definitions/space_body'
import Orbiter from '../lib/simulator/definitions/orbiter'
import KineticSim from '../lib/simulator/kinetic_simulator'
import Position from '../lib/simulator/definitions/position'
import { DISTANCE_FROM_SUN } from '../lib/simulator/constants'
import Simulator_Engine from '@/lib/simulator/simulator_engine';

import { onMounted, render, useTemplateRef } from 'vue';
import Connection from '@/lib/simulator/definitions/connection';
import Sender from '@/lib/simulator/definitions/sender';
import Buffer from 'three/src/renderers/common/Buffer.js';
import Sender_Buffer from '@/lib/simulator/definitions/sender_buffer';
import type { RenderSpaceBody } from './Renderer.vue';

const SIM_SECONDS_PER_FRAME = 10;

const rendererElement = useTemplateRef("rendererElement")

let sun = new SpaceBody(1, "Sun", [new Position(0, 0)])
let mercury = new Orbiter(2, "Mercury", DISTANCE_FROM_SUN.get("Mercury") ?? 0, "Sun", sun)
let venus = new Orbiter(3, "Venus", DISTANCE_FROM_SUN.get("Venus") ?? 0, "Sun", sun)
let earth = new Orbiter(4, "Earth", DISTANCE_FROM_SUN.get("Earth") ?? 0, "Sun", sun)
let mars = new Orbiter(5, "Mars", DISTANCE_FROM_SUN.get("Mars") ?? 0, "Sun", sun)
let satellite = new Orbiter(6, "Satellite", 150000, "Mercury", mercury)

let two_bodies = [sun, earth]
// let kSim = new KineticSim(two_bodies, 100000)
// kSim.calculate_all_positions();
let engine = new Simulator_Engine(two_bodies, 100000)

engine.packet_simulator.connections.push(new Connection(earth, sun));
earth.sender = new Sender( new Sender_Buffer( Array.from({length: 100000}, (_, i) => i) ) );

engine.calculate_all_positions();


let currentTime = 0;

onMounted(() => {

	setInterval(() => {
		if (rendererElement.value != null) {
			rendererElement.value.spaceBodies = engine.bodies.map((kBody) => {
			const kPos = kBody.pos[currentTime];

			// If this is an Orbiter, it has orbitingBody; if it's a plain SpaceBody (Sun), it doesn't.
			const orbitCenterName =
				kBody instanceof Orbiter ? kBody.orbitingBody : undefined;

			return {
				name: kBody.name,
				pos: {
				x: kPos?.x ?? 0,
				y: kPos?.y ?? 0,
				z: 0,
				},
				orbitCenterName, // e.g. "Sun" for planets, "Mercury" for your satellite, undefined for Sun
			} satisfies RenderSpaceBody;
			});

			if (currentTime + SIM_SECONDS_PER_FRAME <= 1000000) {
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