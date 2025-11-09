<script setup lang="ts">

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );



const ringGeometry = new THREE.RingGeometry(1.75, 2, 16, 8 );
const ringMaterial = new THREE.MeshStandardMaterial( {color: 0xff0000, side: THREE.DoubleSide });
const ring = new THREE.Mesh( ringGeometry, ringMaterial );
ring.translateZ(0);
scene.add( ring );

const light = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
scene.add( light );


// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );

scene.add( directionalLight );


camera.position.z = 5;

function animate() {

	ring.rotation.x += 0.01;
	ring.rotation.y += 0.01;

	renderer.render( scene, camera );
}

</script>

<template>
	
</template>