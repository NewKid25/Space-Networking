import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara';
import App from './App.vue'

import SpaceBody from './lib/simulator/definitions/space_body'
import Orbiter from './lib/simulator/definitions/orbiter'
import KineticSim from './lib/simulator/kinetic_simulator'
import Position from './lib/simulator/definitions/position'
import { DISTANCE_FROM_SUN } from './lib/simulator/constants'
import Packet_Simulator from './lib/simulator/packet_simulator'
import Connection from './lib/simulator/definitions/connection'

const app = createApp(App)
app.use(PrimeVue, {
	theme: {
		preset: Lara
	}
})
app.mount('#app')
// let sun = new SpaceBody(1, "Sun", [new Position(0, 0)])
// let earth = new Orbiter(2, "Earth", 1000000, "Sun", sun, new Position(1000000, 0))
// let satellite = new Orbiter(3, "DA MOOOOON", 80000, "Earth", earth, new Position(0, 1080000))

// let two_bodies = [sun, earth, satellite]
// let kSim = new KineticSim(two_bodies, 1000)