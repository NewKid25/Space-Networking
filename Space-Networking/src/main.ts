import { createApp } from 'vue'
import App from './App.vue'

import SpaceBody from './lib/simulator/definitions/space_body'
import Oribiter from './lib/simulator/definitions/orbiter'
import KineticSim from './lib/simulator/kinetic_simulator'
import Position from './lib/simulator/definitions/position'
import { DISTANCE_FROM_SUN } from './lib/simulator/constants'

// createApp(App).mount('#app')
let two_bodies = [new SpaceBody(1, "Sun", [new Position(0, 0)]), new Oribiter(2, "Earth", DISTANCE_FROM_SUN.get("Earth"), )]