const Beliefset =  require('../src/bdi/Beliefset.js')
const Observable =  require('../src/utils/Observable.js')
const Clock =  require('../src/utils/Clock.js')
const Agent = require('../src/bdi/Agent.js')
const Goal = require('../src/bdi/Goal.js')
const Intention = require('../src/bdi/Intention.js')



class House {

    constructor () {

        this.people = {
            man: new Observable ( { name: 'man', in_room: 'kitchen' } ),
            woman: new Observable ( { name: 'woman', in_room: 'bedroom' } )
        }

        this.rooms = {
            kitchen: { 
                name: 'kitchen',
                doors_to: ['living_room'],
                floor: 'ground' },
            living_room: { 
                name: 'living_room',
                doors_to: ['kitchen', 'entrance_hall'],
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
                doors_to: ['bathroom'],
                floor: 'first'},
            outside: { name: 'outside' },
        }
        this.devices = {
            main_light: { on: false },
            car: { charging: false, in_garage: true},
            vacuum_cleaner: { cleaning: false },
            alarm: { on: false },
        }
        
        this.people.man.observe('name', (v, k)=>console.log('person ' + v) )
        this.people.woman.observe('name', (v, k)=>console.log('person ' + v) )
        
        this.people.man.observe('in_room', (v, k)=>console.log('in_room man ' + v) )
        this.people.woman.observe('in_room', (v, k)=>console.log('in_room woman ' + v) )

        Clock.startTimer()
        // Clock.wallClock()
    }

    moveFromKitchenToLivingRoom (name) {
        var person = this.people[name]
        if ( person.in_room == 'kitchen') {
            person.in_room = 'living_room'
            return true
        }
        else
            return false
    }

    /**
     * Allows people to move from their curent position to a
     * specified one.
     * @param {*} personName 
     * @param {*} dstRoom 
     */
    moveTo (personName, dstRoom) {
        if (this.people[personName] && this.rooms[dstRoom])
            this.people[personName].in_room = dstRoom
        for (var person in this.people)
            console.log(this.people.in_room)
    }

    chargeCar () {
        if (this.devices.car.in_garage==true && this.devices.car.charging==false)
            this.devices.car.charging = true
    }

    switchOnLight (l) {
        this.declare('switched-on '+l)
        this.undeclare('switched-off '+l)
    }

    switchOffLight (l) {
        this.undeclare('switched-on '+l)
        this.declare('switched-off '+l)
    }

}



var house = new House()



// Daily schedule
Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    if(time.hh==7 && time.mm==0)
        house.moveTo('woman', 'outside')        //woman goes to work
    if(time.hh==15 && time.mm==0)
        house.moveTo('woman', 'living_room')    //woman gets back from work
    if (time.hh==8 && time.mm==0)
        house.moveTo('man', 'outside')          //man goes to work
        house.devices.car['in_garage'] = false
        house.devices.car['charging'] = false
    if(time.hh==18 && time.mm==30)
        house.moveTo('man', 'garage')
        house.devices.car['in_garage'] = true
        house.chargeCar()
    if(time.hh==19 && time.mm==0)
        house.people.man.in_room = 'kitchen'
    if(time.hh==20 && time.mm==15)
        house.people.man.in_room = 'living_room'
})



var a1 = new Agent('house_agent')

class SetupAlarm extends Goal {

}

class MyAlarm extends Intention {
    static applicable(goal) {
        return goal instanceof SetupAlarm
    }   
    *exec () {
        while(true) {
            yield Clock.global.notifyChange('mm')
            if (Clock.global.hh == 6) {
                console.log('ALARM, it\'s 6am!')
                break;
            }
        }
    }
}

a1.intentions.push(MyAlarm)
// house.moveTo('woman', 'kitchen')

a1.postSubGoal(new SetupAlarm({hh:6, mm:30}))