const Beliefset =  require('../src/bdi/Beliefset.js')
const Observable =  require('../src/utils/Observable.js')
const Clock =  require('../src/utils/Clock.js')
const Agent = require('../src/bdi/Agent.js')
const Goal = require('../src/bdi/Goal.js')
const Intention = require('../src/bdi/Intention.js')
const Person = require('../src/houseworld/Person')
const Light = require('../src/houseworld/Light')
const CoffeeMachine = require('../src/houseworld/CoffeeMachine')
const {AlarmGoal, AlarmIntention} = require('../src/houseworld/Alarm')
const {SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention} = require('../src/houseworld/LightSensor')



class House {
    constructor () {
        this.people = { 
            man: new Person(this, 'man'),
            woman: new Person(this, 'woman'),
             }
        this.rooms = {
            kitchen: { 
                name: 'kitchen',
                doors_to: ['living_room'],
                floor: 'ground' },
            living_room: { 
                name: 'living_room',
                doors_to: ['kitchen', 'entrance_hall','bedroom','bathroom'],
                floor: 'ground' },
            entrance_hall: { 
                name: 'entrance_hall', 
                doors_to: ['living_room', 'washroom', 'outside'],
                floor: 'ground' },
            garage: { 
                name: 'garage',
                doors_to: ['entrance_hall', 'outside'],
                floor: 'ground' },
            washroom: { 
                name: 'washroom', 
                doors_to: ['entrance_hall'],
                floor: 'ground' },
            bathroom: { 
                name: 'bathroom', 
                doors_to: ['bedroom'], 
                floor: 'first' },
            bedroom : {
                name: 'bedroom',
                doors_to: ['bathroom','living_room'],
                floor: 'first'},
            outside: { 
                name: 'outside',
                doors_to: ['entrance_hall','garage'],
                floor: 'ground'},
        }
        this.devices = {
            //lights
            kitchen_light: new Light(this, 'kitchen'),
            living_room_light: new Light(this, 'living_room'),
            garage_light: new Light(this, 'garage'), 
            coffee_machine: new CoffeeMachine(this, 'kitchen'),
            // vacuum_cleaner: new VacuumCleaner(_)
            // car: new Car()
        }
        this.utilities = {
            electricity: new Observable( { consumption: 0 } )
        }
    }
}



// House, which includes rooms and devices
var house = new House()

// Agents
var myAgent = new Agent('myAgent')
myAgent.intentions.push(AlarmIntention)
myAgent.postSubGoal( new AlarmGoal({hh:6, mm:0}) )

myAgent.intentions.push(SenseLightsIntention)
// myAgent.intentions.push(SenseOneLightIntention)
myAgent.postSubGoal( new SenseLightsGoal( [house.devices.kitchen_light, house.devices.garage_light] ) )

// Simulated Daily/Weekly schedule
Clock.global.observe('mm', (mm) => {
    var time = Clock.global
    if (time.hh==6 && time.mm==30) {
        house.devices.kitchen_light.switchOnLight()         // lights turn on
        house.devices.living_room_light.switchOnLight()     // lights turn on
        house.devices.coffee_machine.turnOn()               // turn on coffee machine
        house.people.woman.moveTo('living_room')
        house.people.woman.moveTo('kitchen')
        house.devices.coffee_machine.turnOff()               // turn off coffee machine
        //house.devices.coffee_machine.turnOn()
    }
    if (time.hh==7 && time.mm==0) {
        house.people.woman.moveTo('living_room')
        house.people.woman.moveTo('entrance_hall')
        house.people.woman.moveTo('outside')
    }
    if (time.hh==8 && time.mm==0) {
        house.devices.coffee_machine.turnOn()               // turn off coffee machine
        house.people.man.moveTo('living_room')
        house.people.man.moveTo('entrance_hall')
        house.people.man.moveTo('outside')              //man goes to work
        house.devices.kitchen_light.switchOffLight()    // lights turn off
        house.devices.living_room_light.switchOffLight()    // lights turn off
        // house.devices.car['in_garage'] = false
        // house.devices.car['charging'] = false
    }
    if (time.hh==15 && time.mm==0){
        house.people.woman.moveTo('entrance_hall')
        house.people.woman.moveTo('living_room')
    }        //woman gets back from work
    if (time.hh==18 && time.mm==30){
        house.people.man.moveTo('garage')
        house.people.man.moveTo('entrance_hall')
        house.people.man.moveTo('living_room')
        // house.devices.car['in_garage'] = true
        // house.chargeCar()
        // house.people.man.in_room = 'living_room'
    }
    if (time.hh==22 && time.mm==00){
        house.people.woman.moveTo('bedroom')
        house.people.man.moveTo('bedroom')
    }
    if (time.hh==00 && time.mm==0)
        console.log('Consumptions for day', time.dd + ':', house.utilities.electricity['consumption'])
})

// Start clock
Clock.startTimer()


//allLightsOff()