const Person = require("../../Observables/Residents/Person");
const Light = require("../../Observables/Devices/Light");
const AC = require('../../Observables/Devices/AC');
const Alarm = require('../../Observables/Devices/Alarm')
const Room = require('../../Observables/Environment/Room')

class House {
    constructor () {
        // Residents
        this.people = {
            man:            new Person(this, 'man'),
            woman:          new Person(this, 'woman'),
        }
        // Devices: {lights, appliances, thermostats, alarm}
        this.devices = {
            lights: {
                kLight:     new Light('kLight', 'kitchen'),
                lrLight:    new Light('lrLight', 'livingroom'),
                ehLight:    new Light('ehLight', 'entrancehall'),
                gLight:     new Light('gLight', 'garage'),
                wLight:     new Light('wLight', 'washroom'),
                btLight:    new Light('btLight', 'bathroom'),
                brLight:    new Light('brLight', 'bedroom'),
                oLight:     new Light('oLight', 'outside'),
            },
            appliances: {
                //TODO: add CoffeeMachine class to Devices
                //coffee_machine: new CoffeeMachine(this, 'kitchen'),
            },
            thermostats: {
                kAC:     new AC('kAC', 'kitchen'),
                lrAC:    new AC('lrAC', 'livingroom'),
                ehAC:    new AC('ehAC', 'entrancehall'),
                gAC:     new AC('gAC', 'garage'),
                wAC:     new AC('wAC', 'washroom'),
                btAC:    new AC('btAC', 'bathroom'),
                brAC:    new AC('brAC', 'bedroom'),
                oAC:     new AC('this', 'outside'),
            },
            alarm: {
                groundAlarm: new Alarm('ground', false),
                firstAlarm:  new Alarm('first', false),
                outAlarm:    new Alarm('outside', false),
            },
            // TODO: add Car class
            // car: new Car()
        }
        // Rooms
        this.rooms = {
            kitchen:        new Room('kitchen', ['living_room'], 'ground', [this.devices.lights['kLight'], this.devices.thermostats['kAC']]),
            living_room:    new Room('living_room', ['kitchen', 'entrance_hall','bedroom','bathroom'], 'ground', [this.devices.lights['lrLight'], this.devices.thermostats['lrAC']]),
            entrance_hall:  new Room('entrance_hall', ['living_room', 'washroom', 'garage','outside'], 'ground', [this.devices.lights['ehLight'], this.devices.thermostats['ehAC']]),
            garage:         new Room('garage', ['entrance_hall', 'outside'], 'ground', [this.devices.lights['gLight'], this.devices.thermostats['gAC']]),
            washroom:       new Room('washroom', ['entrance_hall'], 'ground', [this.devices.lights['wLight'], this.devices.thermostats['wAC']]),
            bathroom:       new Room('bathroom', ['bedroom'], 'first', [this.devices.lights['btLight'], this.devices.thermostats['bAC']]),
            bedroom:        new Room('bedroom', ['bathroom','living_room'], 'first', [this.devices.lights['brLight'], this.devices.thermostats['brAC']]),
            outside:        new Room('outside', ['entrance_hall','garage'], 'ground', [this.devices.lights['oLight'], this.devices.thermostats['oAC']]),
        }
    }
}
// let house = new House();

module.exports = House;