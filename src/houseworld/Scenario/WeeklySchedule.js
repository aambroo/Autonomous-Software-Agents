const House = require('../Observers/Environment/HouseLayout')
const Clock = require("../../utils/Clock");

// House init
const house = new House;

// Agents
/*const myAgent = new Agent('myAgent');
myAgent.intentions.push(AlarmIntention)
myAgent.postSubGoal( new AlarmGoal({hh:6, mm:0}) )

myAgent.intentions.push(SenseLightsIntention)
// myAgent.intentions.push(SenseOneLightIntention)
myAgent.postSubGoal( new SenseLightsGoal( [house.devices.kitchen_light, house.devices.garage_light] ) )*/

// Simulated Weekly Schedule
Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    // Managing Weekdays
    if (time.hh===6 && time.mm===30 && time.dd<5) {
        house.people.woman.in_room = 'bedroom';
        house.people.woman.in_room = 'bathroom';
        //house.devices.appliances.coffee_machine.turnOn()
    }
    if (time.hh===6 && time.mm===40 && time.dd<5) {
        house.people.woman.in_room = 'living_room';
        house.people.woman.in_room = 'kitchen';
    }
    if (time.hh===7 && time.mm===00 && time.dd<5) {
        house.people.woman.in_room = 'living_room';
        house.people.woman.in_room = 'entrance_hall';
        house.people.woman.in_room = 'outside';
        //house.devices.appliances.coffee_machine.turnOff()
    }
    if (time.hh===7 && time.mm===30 && time.dd<5) {
        house.people.man.in_room = 'bedroom';
        house.people.man.in_room = 'bathroom';
        //house.devices.appliances.coffee_machine.turnOn()
    }
    if (time.hh===7 && time.mm===40 && time.dd<5) {
        house.people.man.in_room = 'living_room';
        house.people.man.in_room = 'kitchen';
    }
    if (time.hh===8 && time.mm===00 && time.dd<5) {
        house.people.man.in_room = 'living_room';
        house.people.man.in_room = 'entrance_hall';
        house.people.man.in_room = 'garage';
        house.people.man.in_room = 'outside';
        //house.devices.appliances.coffee_machine.turnOff();
        house.devices.alarm.outAlarm.turnOn();
        house.devices.alarm.firstAlarm.turnOn();
        house.devices.alarm.groundAlarm.turnOn();
    }
    if (time.hh===15 && time.mm===00 && time.dd<5) {
        house.devices.alarm.outAlarm.turnOff();
        house.devices.alarm.firstAlarm.turnOff();
        house.devices.alarm.groundAlarm.turnOff();
        house.people.woman.in_room = 'entrance_hall';
        house.people.woman.in_room = 'washroom';
        house.people.woman.in_room = 'living_room';
    }
    if (time.hh===18 && time.mm===00 && time.dd<5) {
        house.people.man.in_room = 'garage';
        house.people.man.in_room = 'entrance_hall';
        house.people.man.in_room = 'washroom';
        house.people.man.in_room = 'living_room';
    }
    if (time.hh===20 && time.mm===30 && time.dd<5) {
        house.people.man.in_room = 'kitchen';
        house.people.woman.in_room = 'kitchen';
    }
    if (time.hh===21 && time.mm===00 && time.dd<5) {
        house.people.man.in_room = 'living_room';
        house.people.woman.in_room = 'living_room';
    }
    if (time.hh===22 && time.mm===30 && time.dd<5) {
        house.people.man.in_room = 'bathroom';
        house.people.man.in_room = 'bedroom';
        house.people.woman.in_room = 'bathroom';
        house.people.woman.in_room = 'bedroom';
        house.devices.alarm.outAlarm.turnOn();
    }

    // Managing Vacation Days
    if (time.hh===9 && time.mm===00 && time.dd>4) {
        house.people.man.in_room = 'bathroom'
        house.people.woman.in_room = 'bathroom'
        //house.devices.appliances.coffee_machine.turnOn()
    }
    if (time.hh===9 && time.mm===30 && time.dd>4) {
        house.people.man.in_room = 'living_room'
        house.people.man.in_room = 'kitchen'
        house.people.woman.in_room = 'living_room'
        house.people.woman.in_room = 'kitchen'
    }
    if (time.hh===10 && time.mm===00 && time.dd>=5) {
        //house.devices.appliances.coffee_machine.turnOff()
    }
    if (time.hh===11 && time.hh===00 && time.dd>=4) {
        house.people.man.in_room = 'living_room'
        house.people.woman.in_room = 'living_room'
    }
    if (time.hh===11 && time.hh===40 && time.dd>=5) {
        house.people.man.in_room = 'washroom'
        house.people.man.in_room = 'living_room'
        house.people.woman.in_room = 'bathroom'
        house.people.woman.in_room = 'living_room'
    }
    if (time.hh===12 && time.hh===30 && time.dd>=5) {
        house.people.man.in_room = 'kitchen'
        house.people.woman.in_room = 'kitchen'
    }
    if (time.hh===13 && time.hh===10 && time.dd>=5) {
        //house.devices.appliances.coffee_machine.turnOn()
    }
    if (time.hh===13 && time.hh===30 && time.dd>=5) {
        house.people.man.in_room = 'living_room'
        house.people.woman.in_room = 'living_room'
        //house.devices.appliances.coffee_machine.turnOff()
    }
    if (time.hh===14 && time.hh===10 && time.dd>=5) {
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
    if (time.hh===20 && time.hh===0o0 && time.dd>=5) {
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
    // if (time.hh===00 && time.mm===0) {
    //     console.log('Consumptions for day', time.dd + ':', house.utilities.electricity)
    // }
})

// Start clock
Clock.startTimer()