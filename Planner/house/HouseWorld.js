const Clock =  require('../src/utils/Clock.js')
const Agent = require('../src/bdi/Agent.js')
const House = require('../house/HouseLayout')
const { LightManagementGoal, LightManagementIntention } = require('../src/houseworld/LightManagement.js')
const { MovementDetectionGoal, MovementDetectionIntention } = require('../src/houseworld/MovementSensor')


// class House {
//     constructor () {
//         this.people = { 
//             man: new Person(this, 'man'),
//             woman: new Person(this, 'woman'),
//              }
//         this.rooms = {
//             kitchen: { 
//                 name: 'kitchen',
//                 doors_to: ['living_room'],
//                 floor: 'ground' },
//             living_room: { 
//                 name: 'living_room',
//                 doors_to: ['kitchen', 'entrance_hall','bedroom','bathroom'],
//                 floor: 'ground' },
//             entrance_hall: { 
//                 name: 'entrance_hall', 
//                 doors_to: ['living_room', 'washroom', 'garage','outside'],
//                 floor: 'ground' },
//             garage: { 
//                 name: 'garage',
//                 doors_to: ['entrance_hall', 'outside'],
//                 floor: 'ground' },
//             washroom: { 
//                 name: 'washroom', 
//                 doors_to: ['entrance_hall'],
//                 floor: 'ground' },
//             bathroom: { 
//                 name: 'bathroom', 
//                 doors_to: ['bedroom'], 
//                 floor: 'first' },
//             bedroom : {
//                 name: 'bedroom',
//                 doors_to: ['bathroom','living_room'],
//                 floor: 'first'},
//             outside: { 
//                 name: 'outside',
//                 doors_to: ['entrance_hall','garage'],
//                 floor: 'ground'},
//         }
//         this.devices = {
//             //lights
//             kitchen_light: new Light(this, 'kitchen'),
//             living_room_light: new Light(this, 'living_room'),
//             garage_light: new Light(this, 'garage'), 
//             coffee_machine: new CoffeeMachine(this, 'kitchen'),
//             // vacuum_cleaner: new VacuumCleaner(_)
//             // car: new Car()
//         }
//         this.utilities = {
//             electricity: new Observable( { consumption: 0 } )
//         }


//     }
// }



// House, which includes rooms and devices

var house = new House()

// Agents
var myAgent = new Agent('myAgent')

myAgent.intentions.push(LightManagementIntention)
myAgent.postSubGoal( new LightManagementGoal (
    [house.devices.lights.kLight, house.devices.lights.lrLight,
     house.devices.lights.ehLight, house.devices.lights.gLight,
     house.devices.lights.wLight, house.devices.lights.btLight,
     house.devices.lights.brLight, house.devices.lights.oLight])
    )
myAgent.intentions.push(MovementDetectionIntention)
myAgent.postSubGoal( new MovementDetectionGoal (
    [house.people.man, house.people.woman],
    [house.rooms.kitchen, house.rooms.living_room, 
     house.rooms.entrance_hall, house.rooms.bathroom,
     house.rooms.garage, house.rooms.outside,
     house.rooms.washroom])
    )


// Simulated Weekly schedule
Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    // Managing Weekdays
    if (time.hh==6 && time.mm==30 && time.dd<5) {
        house.people.woman.in_room = 'bedroom';
        house.people.woman.in_room = 'bathroom';
        house.devices.appliances.coffee_machine.turnOn()
    }
    if (time.hh==6 && time.mm==40 && time.dd<5) {
        house.people.woman.in_room = 'living_room';
        house.people.woman.in_room = 'kitchen';
    }
    if (time.hh==7 && time.mm==00 && time.dd<5) {
        house.people.woman.in_room = 'living_room';
        house.people.woman.in_room = 'entrance_hall';
        house.people.woman.in_room = 'outside';
        house.devices.appliances.coffee_machine.turnOff()
    }
    if (time.hh==7 && time.mm==30 && time.dd<5) {
        house.people.man.in_room = 'bedroom';
        house.people.man.in_room = 'bathroom';
        house.devices.appliances.coffee_machine.turnOn()
    }
    if (time.hh==7 && time.mm==40 && time.dd<5) {
        house.people.man.in_room = 'living_room';
        house.people.man.in_room = 'kitchen';
    }
    if (time.hh==8 && time.mm==00 && time.dd<5) {
        house.people.man.in_room = 'living_room';
        house.people.man.in_room = 'entrance_hall';
        house.people.man.in_room = 'garage';
        house.people.man.in_room = 'outside';
        house.devices.appliances.coffee_machine.turnOff();
        house.devices.alarm.outAlarm.turnOn();
        house.devices.alarm.firstAlarm.turnOn();
        house.devices.alarm.groundAlarm.turnOn();
    }
    if (time.hh==15 && time.mm==00 && time.dd<5) {
        house.devices.alarm.outAlarm.turnOff();
        house.devices.alarm.firstAlarm.turnOff();
        house.devices.alarm.groundAlarm.turnOff();
        house.people.woman.in_room = 'entrance_hall';
        house.people.woman.in_room = 'washroom';
        house.people.woman.in_room = 'living_room';
    }
    if (time.hh==18 && time.mm==00 && time.dd<5) {
        house.people.man.in_room = 'garage';
        house.people.man.in_room = 'entrance_hall';
        house.people.man.in_room = 'washroom';
        house.people.man.in_room = 'living_room';
    }
    if (time.hh==20 && time.mm==30 && time.dd<5) {
        house.people.man.in_room = 'kitchen';
        house.people.woman.in_room = 'kitchen';
    }
    if (time.hh==21 && time.mm==00 && time.dd<5) {
        house.people.man.in_room = 'living_room';
        house.people.woman.in_room = 'living_room';
    }
    if (time.hh==22 && time.mm==30 && time.dd<5) {
        house.people.man.in_room = 'bathroom';
        house.people.man.in_room = 'bedroom';
        house.people.woman.in_room = 'bathroom';
        house.people.woman.in_room = 'bedroom';
        house.devices.alarm.outAlarm.turnOn();
    }

    // Managing Vacation Days
    if (time.hh==9 && time.mm==00 && time.dd>4) {
        house.people.man.in_room = 'bathroom'
        house.people.woman.in_room = 'bathroom'
        house.devices.appliances.coffee_machine.turnOn()
    }
    if (time.hh==9 && time.mm==30 && time.dd>4) {
        house.people.man.in_room = 'living_room'
        house.people.man.in_room = 'kitchen'
        house.people.woman.in_room = 'living_room'
        house.people.woman.in_room = 'kitchen'
    }
    if (time.hh==10 && time.mm==00 && time.dd>=5) {
        house.devices.appliances.coffee_machine.turnOff()
    }
    if (time.hh==11 && time.hh==00 && time.dd>=4) {
        house.people.man.in_room = 'living_room'
        house.people.woman.in_room = 'living_room'
    }
    if (time.hh==11 && time.hh==40 && time.dd>=5) {
        house.people.man.in_room = 'washroom'
        house.people.man.in_room = 'living_room'
        house.people.woman.in_room = 'bathroom'
        house.people.woman.in_room = 'living_room'
    }
    if (time.hh==12 && time.hh==30 && time.dd>=5) {
        house.people.man.in_room = 'kitchen'
        house.people.woman.in_room = 'kitchen'
    }
    if (time.hh==13 && time.hh==10 && time.dd>=5) {
        house.devices.appliances.coffee_machine.turnOn()
    }
    if (time.hh==13 && time.hh==30 && time.dd>=5) {
        house.people.man.in_room = 'living_room'
        house.people.woman.in_room = 'living_room'
        house.devices.appliances.coffee_machine.turnOff()
    }
    if (time.hh==14 && time.hh==10 && time.dd>=5) {
        house.people.man.in_room = 'entrance_hall'
        house.people.woman.in_room = 'entrance_hall'
        house.people.man.in_room = 'garage'
        house.people.woman.in_room = 'garage'
        house.people.man.in_room = 'outside'
        house.people.woman.in_room = 'outside'
        house.devices.alarm.firstAlarm.turnOn()
        house.devices.alarm.groundAlarm.turnOn()
        house.devices.alarm.outAlarm.turnOn()
    }
    if (time.hh==20 && time.hh==00 && time.dd>=5) {
        house.devices.alarm.firstAlarm.turnOff()
        house.devices.alarm.groundAlarm.turnOff()
        house.devices.alarm.outAlarm.turnOff()
        house.people.man.in_room = 'garage'
        house.people.woman.in_room = 'garage'
        house.people.man.in_room = 'entrance_hall'
        house.people.woman.in_room = 'entrance_hall'
        house.people.man.in_room = 'living_room'
        house.people.woman.in_room = 'living_room'
        house.people.man.in_room = 'living_room'
        house.people.woman.in_room = 'living_room'
    }
    // if (time.hh==00 && time.mm==0) {
    //     console.log('Consumptions for day', time.dd + ':', house.utilities.electricity)
    // }
})

// Consumption Management
Clock.global.observe('hh', (key, hh) => {
    for (const [key_l, light] of Object.entries(house.devices.lights)) {
        light.updateConsumption(Clock)
    }
    for (const [key_t, therm] of Object.entries(house.devices.thermostats)) {
        therm.updateConsumption(Clock)
    }
    // for (const [key_r, room] of Object.entries(house.rooms)) {
    //     if (key_r != 'outside') {
    //         room.updateTemperature(Clock)
    //     }
    // }
})

// Start clock
Clock.startTimer()