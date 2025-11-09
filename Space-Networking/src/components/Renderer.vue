<script setup lang="ts">
import type Position from '@/lib/renderer/definitions/position'
import type SpaceBody from '@/lib/renderer/definitions/spaceBody'
import type Packet from '@/lib/renderer/definitions/packet';

import { useTemplateRef, onMounted, render, ref, watch } from 'vue';
import type { Ref } from 'vue';

import createSpaceBodyMesh from '@/lib/renderer/createSpaceBodyMesh';

import * as THREE from 'three';

export type RenderSpaceBody = {
  name: string;
  pos: { x: number; y: number; z: number };
  orbitCenterName?: string;
};

function createOrbitLine(
  radius: number,
  center: THREE.Vector3,
  color = 0x444444,
  lineWidth = 1
): THREE.Line {
  const segments = 128;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);
    points.push(new THREE.Vector3(x, y, 0));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.35,
	linewidth: lineWidth
  });

  return new THREE.LineLoop(geometry, material);
}

const props = defineProps<{
	initialSpaceBodies: RenderSpaceBody[]
}>();


const spaceBodies : Ref<RenderSpaceBody[]> = ref(props.initialSpaceBodies);
const packets : Ref<Packet[]> = ref([]);
const droppedPackets : Ref<Packet[]> = ref([]);

var scene : THREE.Scene;
var camera: THREE.OrthographicCamera;
var renderer : THREE.WebGLRenderer;

const rendererElement = useTemplateRef("rendererElement");

const INITIAL_ZOOM = 0.0009
const ZOOM_INCREMENT = 0.00005

const DRAG_SCALE = 5500;

var mousePosX : number;
var mousePosY : number;

var spaceBodyThreeObjects : THREE.Object3D[] = [];

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
		camera.translateZ(200000);
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


			mousePosX = ( e.offsetX / rendererElement.value.clientWidth ) * 2 - 1;
			mousePosY = - ( e.offsetY / rendererElement.value.clientHeight ) * 2 + 1;

			// console.log(pointerX, pointerY);			
		})
	}
});

// When space bodies are updated, re-render scene

/*
watch(spaceBodies, (newSpaceBodies) => {
  if (!scene || !camera || !renderer) return;

  scene.clear();

  const ambient = new THREE.AmbientLight(0x404040, 20);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(0, 0, 500000);
  scene.add(dirLight);

  // name -> position lookup
  const positions = new Map<string, THREE.Vector3>();
  for (const body of newSpaceBodies) {
    positions.set(
      body.name,
      new THREE.Vector3(body.pos.x, body.pos.y, body.pos.z)
    );
  }



  // Draw orbit paths
  // orbit lines
for (const body of newSpaceBodies) {
  if (!body.orbitCenterName) continue; // skip Sun / non-orbiters

  const bodyPos = positions.get(body.name)!;
  const centerPos = positions.get(body.orbitCenterName);
  if (!centerPos) continue;

  const radius = bodyPos.distanceTo(centerPos);
  if (radius <= 0) continue;

  const color = body.name === "Satellite" ? 0x8888ff : 0x444444;
  const orbitLine = createOrbitLine(radius, centerPos, color);
  scene.add(orbitLine);
  }

  // Draw bodies
  for (const body of newSpaceBodies) {
    const mesh = createSpaceBodyMesh(body as any);
    mesh.position.set(body.pos.x, body.pos.y, body.pos.z);
    scene.add(mesh);
  }

  renderer.render(scene, camera);
});
*/

/*
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

	spaceBodyThreeObjects = [];

	const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
	dirLight.position.set(0, 0, 500000);
	scene.add(dirLight);

	// name -> position lookup
	const positions = new Map<string, THREE.Vector3>();
	for (const body of spaceBodies.value) {
		positions.set(
		body.name,
		new THREE.Vector3(body.pos.x, body.pos.y, body.pos.z)
		);
	}



	// Draw orbit paths
	// orbit lines
	for (const body of spaceBodies.value) {
		if (!body.orbitCenterName) continue; // skip Sun / non-orbiters

		const bodyPos = positions.get(body.name)!;
		const centerPos = positions.get(body.orbitCenterName);
		if (!centerPos) continue;

		const radius = bodyPos.distanceTo(centerPos);
		if (radius <= 0) continue;

		const color = body.name === "Satellite" ? 0x8888ff : 0x444444;
		const orbitLine = createOrbitLine(radius, centerPos, color);
		scene.add(orbitLine);
	}

	// Draw bodies
	for (const body of spaceBodies.value) {
		const mesh = createSpaceBodyMesh(body as any);
		mesh.position.set(body.pos.x, body.pos.y, body.pos.z);
		scene.add(mesh);
		spaceBodyThreeObjects.push(mesh);
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

	
	let raycaster = new THREE.Raycaster
	raycaster.setFromCamera( new THREE.Vector2(mousePosX, mousePosY), camera );
	console.log(mousePosX, mousePosY);

	const intersects = raycaster.intersectObjects( spaceBodyThreeObjects, true );

	// console.log(spaceBodyThreeObjects);

	if ( intersects.length > 0 ) {

		const object = intersects[ 0 ].object;
		console.log(object)

		object.userData.highlighted = true;
		scene.add(createOrbitLine(object.geometry.boundingSphere.radius * 1.1, object.position, 0xffffff, 300));


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