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


		renderer = new THREE.WebGLRenderer();
		renderer.setSize( rendererElement.value.offsetWidth, rendererElement.value.offsetHeight );
		rendererElement.value.appendChild( renderer.domElement );

		const geometry = new THREE.SphereGeometry( 695508 );
		const material = new THREE.MeshStandardMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
		const sphere = new THREE.Mesh( geometry, material );
		scene.add( sphere );



		const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
		scene.add( light );

		camera.zoom = .0004;
		camera.updateProjectionMatrix();

		renderer.render( scene, camera );
	}
});

// When space bodies are updated, re-render scene
watch(spaceBodies, (newSpaceBodies) => {

	scene.clear();

	const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
	scene.add( light );

	for (const spaceBody of newSpaceBodies) {

		const mesh = createSpaceBodyMesh(spaceBody);

		// const textureLoader = new THREE.TextureLoader();
// textureLoader.load(
//   'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', // Image to load
//   (texture) => {
//     // This function runs when the image is loaded successfully
// 	const geometry = new THREE.SphereGeometry( 49528 );
//     const material = new THREE.MeshBasicMaterial({ map: texture });
//     const mesh = new THREE.Mesh(geometry, material);
	
// 		mesh.translateX(spaceBody.pos.x);
// 		mesh.translateY(spaceBody.pos.y);
// 		mesh.translateZ(spaceBody.pos.z);
//     	scene.add(mesh);
//   }
// );

		mesh.translateX(spaceBody.pos.x);
		mesh.translateY(spaceBody.pos.y);
		mesh.translateZ(spaceBody.pos.z);
		scene.add( mesh );
	}

	renderer.render( scene, camera );

	setTimeout(() => {renderer.render(scene, camera)},500);
});

function renderFrame() {
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