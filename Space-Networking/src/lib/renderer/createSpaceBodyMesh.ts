import type SpaceBody from "../renderer/definitions/spaceBody";
import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

import mercuryImgSrc from "../assets/mercury.jpg"
import venusImgSrc from "../assets/venus.jpg"
import earthImgSrc from "../assets/earth.jpg"
import marsImgSrc from "../assets/mars.jpg"
import jupiterImgSrc from "../assets/jupiter.jpg"
import saturnImgSrc from "../assets/saturn.jpg"
import uranusImgSrc from "../assets/uranus.jpg"
import neptuneImgSrc from "../assets/neptune.jpg"
import sunImgSrc from "../assets/sun.jpg"


const textures = {
	"mercury": new THREE.TextureLoader().load(mercuryImgSrc),
	"venus": new THREE.TextureLoader().load(venusImgSrc),
	"earth": new THREE.TextureLoader().load(earthImgSrc),
	"mars": new THREE.TextureLoader().load(marsImgSrc),
	"jupiter": new THREE.TextureLoader().load(jupiterImgSrc),
	"saturn": new THREE.TextureLoader().load(saturnImgSrc),
	"uranus": new THREE.TextureLoader().load(uranusImgSrc),
	"neptune": new THREE.TextureLoader().load(neptuneImgSrc),
	"sun": new THREE.TextureLoader().load(sunImgSrc),
}

const gltfLoader = new GLTFLoader();
const satelliteModelUrl = new URL("../assets/satellite.glb", import.meta.url).href;

let satelliteTemplate: THREE.Object3D | null = null;

gltfLoader.load(
  satelliteModelUrl,
  (gltf) => {
    const root = gltf.scene || gltf.scenes[0];
    root.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Adjust this so it reads well in your scale
    root.scale.set(20000, 20000, 20000);

    satelliteTemplate = root;
  },
  undefined,
  (err) => console.error("Error loading satellite model:", err)
);

export default function createSpaceBodyMesh(spaceBody : SpaceBody) {

	switch(spaceBody.name)
	{
		case 'Mercury':
			const mercuryGeometry = new THREE.SphereGeometry( 4880*3 );
			textures.mercury.colorSpace = THREE.SRGBColorSpace;
			const mercuryMaterial = new THREE.MeshStandardMaterial({
				map: textures.mercury, 
			})
			return new THREE.Mesh(mercuryGeometry, mercuryMaterial);

		case 'Venus':
			const venusGeometry = new THREE.SphereGeometry( 12104*3 );
			textures.venus.colorSpace = THREE.SRGBColorSpace;
			const venusMaterial = new THREE.MeshStandardMaterial({
				map: textures.venus, 
			})
			return new THREE.Mesh(venusGeometry, venusMaterial);

		case 'Earth':
			const earthGeometry = new THREE.SphereGeometry( 12756*3 );
			textures.earth.colorSpace = THREE.SRGBColorSpace;
			const earthMaterial = new THREE.MeshStandardMaterial({
				map: textures.earth, 
			})
			return new THREE.Mesh(earthGeometry, earthMaterial);

		case 'Mars':
			const marsGeometry = new THREE.SphereGeometry( 6792*3 );
			textures.mars.colorSpace = THREE.SRGBColorSpace;
			const marsMaterial = new THREE.MeshStandardMaterial({
				map: textures.mars, 
			})
			return new THREE.Mesh(marsGeometry, marsMaterial);

		case 'Jupiter':
			const jupiterGeometry = new THREE.SphereGeometry( 142984 );
			textures.jupiter.colorSpace = THREE.SRGBColorSpace;
			const jupiterMaterial = new THREE.MeshStandardMaterial({
				map: textures.jupiter, 
			})
			return new THREE.Mesh(jupiterGeometry, jupiterMaterial);

		case 'Saturn':
			const saturnGeometry = new THREE.SphereGeometry( 120536 );
			textures.saturn.colorSpace = THREE.SRGBColorSpace;
			const saturnMaterial = new THREE.MeshStandardMaterial({
				map: textures.saturn, 
			})
			return new THREE.Mesh(saturnGeometry, saturnMaterial);

		case 'Uranus':
			const uranusGeometry = new THREE.SphereGeometry( 51118 );
			textures.uranus.colorSpace = THREE.SRGBColorSpace;
			const uranusMaterial = new THREE.MeshStandardMaterial({
				map: textures.uranus, 
			})
			return new THREE.Mesh(uranusGeometry, uranusMaterial);

		case 'Neptune':
			const neptuneGeometry = new THREE.SphereGeometry( 49528 );
			textures.neptune.colorSpace = THREE.SRGBColorSpace;
			const neptuneMaterial = new THREE.MeshBasicMaterial({
				map: textures.neptune,
			})
			return new THREE.Mesh(neptuneGeometry, neptuneMaterial);

		case 'Sun':
			const sunGeometry = new THREE.SphereGeometry( 100000 );
			textures.sun.colorSpace = THREE.SRGBColorSpace;
			const sunMaterial = new THREE.MeshBasicMaterial({
				map: textures.sun,
			})
			return new THREE.Mesh(sunGeometry, sunMaterial);

		// Satellite
		default:
			if (satelliteTemplate) {
					// clone so each satellite is independent
					const satellite = satelliteTemplate.clone(true);
					return satellite;
				} else {
					// temporary visible placeholder while GLB loads
					const g = new THREE.BoxGeometry(15000, 15000, 30000);
					const m = new THREE.MeshStandardMaterial({ color: 0xffffff });
					return new THREE.Mesh(g, m);
				}
				

			// const geometry = new THREE.SphereGeometry( 95508 );
			// const material = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
			// return new THREE.Mesh( geometry, material );
	}
	
}