const Clock =  require('../utils/Clock')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const Person = require('./Observables/Residents/Person')
const Light = require('./Observables/Devices/Light')
const {AlarmGoal, AlarmIntention} = require('./Observables/Devices/Alarm')
const {SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention} = require('./LightSensor')




// House, which includes rooms and devices
var myHouse = new House()

// Agents
var myAgent = new Agent('myAgent')
myAgent.intentions.push(AlarmIntention)
myAgent.postSubGoal( new AlarmGoal({hh:6, mm:0}) )

myAgent.intentions.push(SenseLightsIntention)
// myAgent.intentions.push(SenseOneLightIntention)
myAgent.postSubGoal( new SenseLightsGoal( [myHouse.devices.kitchen_light, myHouse.devices.garage_light] ) )

// Simulated Daily/Weekly schedule
Clock.global.observe('mm', (mm) => {
    var time = Clock.global
    if(time.hh==6 && time.mm==0)
        myHouse.devices.kitchen_light.switchOnLight()
    if(time.hh==12 && time.mm==0)
        myHouse.people.bob.moveTo('kitchen')
    if(time.hh==13 && time.mm==30)
        myHouse.people.bob.moveTo('living_room')
    if(time.hh==19 && time.mm==0)
        myHouse.people.bob.moveTo('kitchen')
    if(time.hh==20 && time.mm==15)
        myHouse.people.bob.moveTo('living_room')
        // myHouse.people.bob.in_room = 'living_room'
})

// Start clock
Clock.startTimer()