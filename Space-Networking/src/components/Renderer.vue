<script setup lang="ts">
import type Position from '@/lib/renderer/definitions/position'
import type SpaceBody from '@/lib/renderer/definitions/spaceBody'
import type Packet from '@/lib/renderer/definitions/packet';

import { useTemplateRef, onMounted, render, ref, watch } from 'vue';
import type { Ref } from 'vue';

import createSpaceBodyMesh from '@/lib/renderer/createSpaceBodyMesh';

import * as THREE from 'three';

const props = defineProps<{
	initialSpaceBodies: SpaceBody[]
}>();


const spaceBodies : Ref<SpaceBody[]> = ref(props.initialSpaceBodies);
const packets : Ref<Packet[]> = ref([]);
const droppedPackets : Ref<Packet[]> = ref([]);

var scene : THREE.Scene;
var camera: THREE.OrthographicCamera;
var renderer : THREE.WebGLRenderer;

const rendererElement = useTemplateRef("rendererElement");

const INITIAL_ZOOM = 0.0009
const ZOOM_INCREMENT = 0.00005

const DRAG_SCALE = 1500;

// Make this visible to parents
defineExpose({
	spaceBodies,
	packets,
	droppedPackets,
	renderFrame
});

// When this component is loaded, create the three.js
// scene
onMounted(() => {
	if (rendererElement.value != null)
	{
		scene = new THREE.Scene();
		// const camera = new THREE.PerspectiveCamera( 75, rendererElement.value.clientWidth / rendererElement.value.clientHeight, 0.1, 1000 );
		camera = new THREE.OrthographicCamera( -rendererElement.value.clientWidth, rendererElement.value.clientWidth, -rendererElement.value.clientHeight, rendererElement.value.clientHeight, 0, 1000000)


		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize( rendererElement.value.offsetWidth, rendererElement.value.offsetHeight );
		rendererElement.value.appendChild( renderer.domElement );

		const geometry = new THREE.SphereGeometry( 695508 );
		const material = new THREE.MeshStandardMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
		const sphere = new THREE.Mesh( geometry, material );
		scene.add( sphere );



		const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
		scene.add( light );

		camera.zoom = INITIAL_ZOOM;
		camera.updateProjectionMatrix();

		renderer.render( scene, camera );

		// Scroll wheel event listener:  Zooming
		rendererElement.value.addEventListener("wheel", (e) => {
			if (e.deltaY < 0) {
				console.log(e.deltaY);
				camera.zoom += ZOOM_INCREMENT;
				camera.updateProjectionMatrix();

				renderFrame();

			}

			if (e.deltaY > 0) {
				console.log(e.deltaY);
				camera.zoom -= ZOOM_INCREMENT;
				camera.updateProjectionMatrix();

				renderFrame();
			}
		})

		// Mouse move event listener:  Dragging viewport
		rendererElement.value.addEventListener("mousemove", (e) => {
			// if mouse button down
			if (Boolean(e.buttons & (1))) {
				console.log(e.movementX);

				camera.left -= e.movementX * DRAG_SCALE;
				camera.right -= e.movementX * DRAG_SCALE;

				camera.top -= e.movementY * DRAG_SCALE;
				camera.bottom -= e.movementY * DRAG_SCALE;

				camera.updateProjectionMatrix();

				renderFrame();
			}
		})
	}
});

// When space bodies are updated, re-render scene
/*
watch(spaceBodies, (newSpaceBodies) => {

	scene.clear();

	const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
	scene.add( light );

	for (const spaceBody of newSpaceBodies) {

		const mesh = createSpaceBodyMesh(spaceBody);

		mesh.translateX(spaceBody.pos.x);
		mesh.translateY(spaceBody.pos.y);
		mesh.translateZ(spaceBody.pos.z);
		scene.add( mesh );
	}

	renderer.render( scene, camera );
});

watch(packets, (newPackets) => {
	scene.clear();

	const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
	scene.add( light );

	const geometry = new THREE.SphereGeometry( 5000 );
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );

	for (const packet of newPackets) {
		const mesh = new THREE.Mesh( geometry, material );

		mesh.translateX(packet.pos.x);
		mesh.translateY(packet.pos.y);
		mesh.translateZ(packet.pos.z);
		scene.add( mesh );
	}

	renderer.render( scene, camera );
})
*/

function renderFrame() {

	scene.clear();

	const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
	scene.add( light );

	for (const spaceBody of spaceBodies.value) {

		const mesh = createSpaceBodyMesh(spaceBody);

		mesh.translateX(spaceBody.pos.x);
		mesh.translateY(spaceBody.pos.y);
		mesh.translateZ(spaceBody.pos.z);
		scene.add( mesh );
	}

	const geometry = new THREE.SphereGeometry( 5000 );
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );

	for (const packet of packets.value) {
		const mesh = new THREE.Mesh( geometry, material );

		mesh.translateX(packet.pos.x);
		mesh.translateY(packet.pos.y);
		mesh.translateZ(packet.pos.z);
		scene.add( mesh );
	}

	renderer.render( scene, camera );
}



</script>

<template>
	<div ref="rendererElement" id="rendererElement">
	</div>
</template>

<style scoped>
	div {
		width: 500px;
		height: 500px;
	}
</style>