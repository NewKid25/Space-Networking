import type SpaceBody from "../renderer/definitions/spaceBody";
import * as THREE from 'three';

import mercuryImgSrc from "../assets/mercury.jpg"
import venusImgSrc from "../assets/venus.jpg"
import earthImgSrc from "../assets/earth.jpg"
import marsImgSrc from "../assets/mars.jpg"
import jupiterImgSrc from "../assets/jupiter.jpg"
import saturnImgSrc from "../assets/saturn.jpg"
import uranusImgSrc from "../assets/uranus.jpg"
import neptuneImgSrc from "../assets/neptune.jpg"

const textures = {
	"mercury": new THREE.TextureLoader().load(mercuryImgSrc),
	"venus": new THREE.TextureLoader().load(venusImgSrc),
	"earth": new THREE.TextureLoader().load(earthImgSrc),
	"mars": new THREE.TextureLoader().load(marsImgSrc),
	"jupiter": new THREE.TextureLoader().load(jupiterImgSrc),
	"saturn": new THREE.TextureLoader().load(saturnImgSrc),
	"uranus": new THREE.TextureLoader().load(uranusImgSrc),
	"neptune": new THREE.TextureLoader().load(neptuneImgSrc),
}

export default function createSpaceBodyMesh(spaceBody : SpaceBody) {

	switch(spaceBody.name)
	{
		case 'Mercury':
			const mercuryGeometry = new THREE.SphereGeometry( 4880 );
			textures.mercury.colorSpace = THREE.SRGBColorSpace;
			const mercuryMaterial = new THREE.MeshStandardMaterial({
				map: textures.mercury, 
			})
			return new THREE.Mesh(mercuryGeometry, mercuryMaterial);

		case 'Venus':
			const venusGeometry = new THREE.SphereGeometry( 12104 );
			textures.venus.colorSpace = THREE.SRGBColorSpace;
			const venusMaterial = new THREE.MeshStandardMaterial({
				map: textures.venus, 
			})
			return new THREE.Mesh(venusGeometry, venusMaterial);

		case 'Earth':
			const earthGeometry = new THREE.SphereGeometry( 12756 );
			textures.earth.colorSpace = THREE.SRGBColorSpace;
			const earthMaterial = new THREE.MeshStandardMaterial({
				map: textures.earth, 
			})
			return new THREE.Mesh(earthGeometry, earthMaterial);

		case 'Mars':
			const marsGeometry = new THREE.SphereGeometry( 6792 );
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
			// const sunGeometry = new THREE.SphereGeometry( 100000 );
			// textures.neptune.colorSpace = THREE.SRGBColorSpace;
			// const neptuneMaterial = new THREE.MeshBasicMaterial({
			// 	map: textures.neptune,
			// })
			// return new THREE.Mesh(neptuneGeometry, neptuneMaterial);

		// Satellite
		default:
			const geometry = new THREE.SphereGeometry( 95508 );
			const material = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
			return new THREE.Mesh( geometry, material );
	}
	
}