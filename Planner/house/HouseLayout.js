const Person = require('../src/houseworld/Person')
const Room = require('../src/houseworld/Room')
const Light = require('../src/houseworld/Light')
const CoffeeMachine = require('../src/houseworld/CoffeeMachine')
const HeatPump = require('../src/houseworld/HeatPump.js')
const AntiIntrusionAlarm = require('../src/houseworld/AntiIntrusionSystem.js')



class House {
    constructor () {
        this.people = { 
            man:            new Person(this, 'man'),
            woman:          new Person(this, 'woman'),
             }

        this.devices = {
            lights: {
                kLight:     new Light(this, 'kitchen'),
                lrLight:    new Light(this, 'living_room'),
                ehLight:    new Light(this, 'entrance_hall'),
                gLight:     new Light(this, 'garage'),
                wLight:     new Light(this, 'washroom'),
                btLight:    new Light(this, 'bathroom'),
                brLight:    new Light(this, 'bedroom'),
                oLight:     new Light(this, 'outside'),
            },
            appliances: {
                coffee_machine: new CoffeeMachine(this, 'kitchen'),
                // vacuum_cleaner: new VacuumCleaner(_)
            },
            thermostats: {
                kTherm:     new HeatPump(this),
                lrTherm:    new HeatPump(this),
                ehTherm:    new HeatPump(this),
                gTherm:     new HeatPump(this),
                wTherm:     new HeatPump(this),
                btTherm:    new HeatPump(this),
                brTherm:     new HeatPump(this),
                oTherm:     new HeatPump(this),
            },
            alarm: {
                groundAlarm: new AntiIntrusionAlarm(this, 'ground', false),
                firstAlarm:  new AntiIntrusionAlarm(this, 'ground', false),
                outAlarm:    new AntiIntrusionAlarm(this, 'ground', false),
            },
            // car: new Car()
        }

        this.rooms = {
            kitchen:        new Room(this, 'kitchen', ['living_room'], 'ground', this.devices.lights['kLight'], this.devices.thermostats['kTherm']),
            living_room:    new Room(this, 'living_room', ['kitchen', 'entrance_hall','bedroom','bathroom'], 'ground', this.devices.lights['lrLight'], this.devices.thermostats['lrTherm']),
            entrance_hall:  new Room(this, 'entrance_hall', ['living_room', 'washroom', 'garage','outside'], 'ground', this.devices.lights['ehLight'], this.devices.thermostats['ehTherm']),
            garage:         new Room(this, 'garage', ['entrance_hall', 'outside'], 'ground', this.devices.lights['gLight'], this.devices.thermostats['gTherm']),
            washroom:       new Room(this, 'washroom', ['entrance_hall'], 'ground', this.devices.lights['wLight'], this.devices.thermostats['wTherm']),
            bathroom:       new Room(this, 'bathroom', ['bedroom'], 'first', this.devices.lights['btLight'], this.devices.thermostats['bTherm']),
            bedroom:        new Room(this, 'bedroom', ['bathroom','living_room'], 'first', this.devices.lights['brLight'], this.devices.thermostats['brTherm']),
            outside:        new Room(this, 'outside', ['entrance_hall','garage'], 'ground', this.devices.lights['oLight'], this.devices.thermostats['oTherm']),
        }

        this.people.man.observe('in_room', (v, k) => {
            console.log('man in_room', v)
        })
        this.people.woman.observe('in_room', (v, k) => {
            console.log('woman in_room', v)
        })
        
        this.utilities = {
            electricity: { consumption: 0 }
        }
    }
}

module.exports = House