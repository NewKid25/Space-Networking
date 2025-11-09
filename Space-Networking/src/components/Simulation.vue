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

import { TestDataScenario, SimpleLineScenario } from '@/lib/simulator/scenarios/index';

var SIM_SECONDS_PER_FRAME = 10;

const rendererElement = useTemplateRef("rendererElement")

interface Props {
	setup?: SpaceBody[];
	elemWidth?: string;
	elemHeight?: string;
	simSec?: number | [number, number];
	maxSecondsSim?: number
}

const props = withDefaults(defineProps<Props>(), {
	elemWidth: '500px', elemHeight: '500px', maxSecondsSim: 500000
});

const simBodies: SpaceBody[] = props.setup ?? TestDataScenario;

const earth = simBodies.find((b) => b.name === "Earth");
const mars = simBodies.find((b) => b.name === "Mars");
const engine = new Simulator_Engine(simBodies, props.maxSecondsSim, earth!, mars!, 10000)
// let kSim = new KineticSim(two_bodies, 100000)
// kSim.calculate_all_positions();


engine.calculate_all_positions();
// console.log(engine.packets_in_flight)
// throw new Error()

let currentTime = 0;

onMounted(() => {
	if (typeof props.simSec == 'number') SIM_SECONDS_PER_FRAME = props.simSec;

	setInterval(() => {
		if (!rendererElement.value) return;
			rendererElement.value.spaceBodies = engine.bodies.map((kBody) => {
			const isOrbiter = kBody instanceof Orbiter;

			// Orbiters: use time-indexed position.
			// Static SpaceBody (like in SimpleLineScenario): always use pos[0].
			const kPos = isOrbiter
				? kBody.pos[currentTime]
				: kBody.pos[0];

			const orbitCenterName = isOrbiter ? kBody.orbitingBody : undefined;

			return {
				name: kBody.name,
				pos: {
				x: kPos?.x ?? 0,
				y: kPos?.y ?? 0,
				z: 0,
				},
				orbitCenterName,
			} satisfies RenderSpaceBody;
			});

			rendererElement.value.packets = (engine.packets_in_flight[currentTime] ?? []).map((packetInFlight) => {
				let kPos = packetInFlight.position;
			

				return {
					pos: {x: kPos._x, y: kPos._y, z: 0},
					streamID: "no"
				}
			})

			if (currentTime + SIM_SECONDS_PER_FRAME <= props.maxSecondsSim) {
				currentTime += SIM_SECONDS_PER_FRAME;
			} else {
				currentTime = 0;
			}
			console.log(currentTime, SIM_SECONDS_PER_FRAME);

			rendererElement.value.renderFrame();
	}, 100);
});

</script>

<template>
	<p>Hello</p>
	<Renderer :initial-space-bodies="[]" ref="rendererElement"> </Renderer>
	<input type="range" v-if="Array.isArray(props.simSec)" :min="props.simSec[0]" :max="props.simSec[1]" v-model="SIM_SECONDS_PER_FRAME"></input>
	<slot> <!-- Other controls go here --> </slot>
</template>