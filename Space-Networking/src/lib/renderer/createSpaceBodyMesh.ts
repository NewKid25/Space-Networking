import type SpaceBody from "../renderer/definitions/spaceBody";
import * as THREE from 'three';


export default function createSpaceBodyMesh(spaceBody : SpaceBody) {

	switch(spaceBody.name)
	{
		case 'Mercury':
			const mercuryGeometry = new THREE.SphereGeometry( 4880 );
			const mercuryTexture = new THREE.TextureLoader().load('../assets/mercury.jpg');
			const mercuryMaterial = new THREE.MeshStandardMaterial({
				map: mercuryTexture, 
			})
			return new THREE.Mesh(mercuryGeometry, mercuryMaterial);

		case 'Venus':
			const venusGeometry = new THREE.SphereGeometry( 12104 );
			const venusTexture = new THREE.TextureLoader().load('../assets/venus.jpg');
			const venusMaterial = new THREE.MeshStandardMaterial({
				map: venusTexture, 
			})
			return new THREE.Mesh(venusGeometry, venusMaterial);

		case 'Earth':
			const earthGeometry = new THREE.SphereGeometry( 12756 );
			const earthTexture = new THREE.TextureLoader().load('../assets/earth.jpg');
			const earthMaterial = new THREE.MeshStandardMaterial({
				map: earthTexture, 
			})
			return new THREE.Mesh(earthGeometry, earthMaterial);

		case 'Mars':
			const marsGeometry = new THREE.SphereGeometry( 6792 );
			const marsTexture = new THREE.TextureLoader().load('../assets/mars.jpg');
			const marsMaterial = new THREE.MeshStandardMaterial({
				map: marsTexture, 
			})
			return new THREE.Mesh(marsGeometry, marsMaterial);

		case 'Jupiter':
			const jupiterGeometry = new THREE.SphereGeometry( 142984 );
			const jupiterTexture = new THREE.TextureLoader().load('../assets/jupiter.jpg');
			const jupiterMaterial = new THREE.MeshStandardMaterial({
				map: jupiterTexture, 
			})
			return new THREE.Mesh(jupiterGeometry, jupiterMaterial);

		case 'Saturn':
			const saturnGeometry = new THREE.SphereGeometry( 120536 );
			const saturnTexture = new THREE.TextureLoader().load('../assets/saturn.jpg');
			const saturnMaterial = new THREE.MeshStandardMaterial({
				map: saturnTexture, 
			})
			return new THREE.Mesh(saturnGeometry, saturnMaterial);

		case 'Uranus':
			const uranusGeometry = new THREE.SphereGeometry( 51118 );
			const uranusTexture = new THREE.TextureLoader().load('../assets/uranus.jpg');
			const uranusMaterial = new THREE.MeshStandardMaterial({
				map: uranusTexture, 
			})
			return new THREE.Mesh(uranusGeometry, uranusMaterial);

		case 'Neptune':
			// const neptuneGeometry = new THREE.SphereGeometry( 49528 );
			// const neptuneTexture = new THREE.TextureLoader().load('../assets/neptune.jpg');
			// const neptuneMaterial = new THREE.MeshStandardMaterial({
			// 	map: neptuneTexture, 
			// })
			// return new THREE.Mesh(neptuneGeometry, neptuneMaterial);

		case 'Sun':


		// Satellite
		default:
			const neptuneGeometry = new THREE.SphereGeometry( 49528 );
			const neptuneTexture = new THREE.TextureLoader().load('https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=');
			neptuneTexture.colorSpace = THREE.SRGBColorSpace;

			const neptuneMaterial = new THREE.MeshStandardMaterial({
				map: neptuneTexture, 
			})
			return new THREE.Mesh(neptuneGeometry, neptuneMaterial);
			// const geometry = new THREE.SphereGeometry( 95508 );
			// const material = new THREE.MeshStandardMaterial;
			// return new THREE.Mesh( geometry, material );
	}
	
}