export const DISTANCE_FROM_SUN: Map<string, number> = new Map([
    ["Mercury", 58*10**4],
    ["Venus", 109*10**4],
    ["Earth", 150*10**4],
    ["Mars", 228*10**4],
    ["Jupiter", 778*10**6],
    ["Saturn", 1.4*10**9],
    ["Uranus", 2.9*10**9],
    ["Neptune", 4.5*10**9]
])

export const GM_CONSTANTS: Map<string, number> = new Map([
    // ["Sun", 1.327*10**11],
    ["Sun", 398600.435507],
    ['Mercury', 22031.868551],
    ['Venus', 324858.592000],
    ['Earth', 398600.435507],
    ['Mars', 42828.375816],
    ['Jupiter', 126712764.10],
    ['Saturn', 37940584.8418],
    ['Uranus', 5794556.40],
    ['Neptune', 6836527.10058]
])

export var LIGHT_SPEED =  2997 //km/s
export const LOSS_RATE = 0.01