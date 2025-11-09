import { createApp } from 'vue'
import App from './App.vue'

import SpaceBody from './lib/simulator/definitions/space_body'
import Oribiter from './lib/simulator/definitions/orbiter'
import KineticSim from './lib/simulator/kinetic_simulator'
import Position from './lib/simulator/definitions/position'
import { DISTANCE_FROM_SUN } from './lib/simulator/constants'

// createApp(App).mount('#app')
let sun = new SpaceBody(1, "Sun", [new Position(0, 0)])
let earth = new Oribiter(2, "Earth", 1000000, "Sun", sun, new Position(1000000, 0))
let satellite = new Oribiter(3, "DA MOOOOON", 80000, "Earth", earth, new Position(0, 1080000))

let two_bodies = [sun, earth, satellite]
let kSim = new KineticSim(two_bodies, 1000)