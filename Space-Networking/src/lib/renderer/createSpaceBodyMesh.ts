import type SpaceBody from "../renderer/definitions/spaceBody";
import * as THREE from 'three';


export default function createSpaceBodyMesh(spaceBody : SpaceBody) {

		const geometry = new THREE.SphereGeometry( 95508 );
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
		const sphere = new THREE.Mesh( geometry, material );

		return sphere;

}