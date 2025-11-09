<script setup lang="ts">
import type Position from '@/lib/renderer/definitions/position'
import type SpaceBody from '@/lib/renderer/definitions/spaceBody'
import type Packet from '@/lib/renderer/definitions/packet';

import { useTemplateRef, onMounted, render } from 'vue';

import * as THREE from 'three';

const props = defineProps<{
	spaceBodies: SpaceBody[]
	packets: Packet[]
	droppedPackets: Packet[]
}>();

const rendererElement = useTemplateRef("rendererElement");


// When this component is loaded, create the three.js
// scene
onMounted(() => {
	if (rendererElement.value != null)
	{
		const scene = new THREE.Scene();
		// const camera = new THREE.PerspectiveCamera( 75, rendererElement.value.clientWidth / rendererElement.value.clientHeight, 0.1, 1000 );
		const camera = new THREE.OrthographicCamera( -rendererElement.value.clientWidth, rendererElement.value.clientWidth, -rendererElement.value.clientHeight, rendererElement.value.clientHeight, 0, 1000000)


		const renderer = new THREE.WebGLRenderer();
		renderer.setSize( rendererElement.value.offsetWidth, rendererElement.value.offsetHeight );
		rendererElement.value.appendChild( renderer.domElement );

		const geometry = new THREE.SphereGeometry( 695508 );
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
		const sphere = new THREE.Mesh( geometry, material );
		scene.add( sphere );



		const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
		scene.add( light );

		camera.zoom = .0001;
		camera.updateProjectionMatrix();

		renderer.render( scene, camera );
	}
});



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