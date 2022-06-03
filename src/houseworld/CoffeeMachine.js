const Observable = require('../utils/Observable');
const Clock =  require('../utils/Clock')


class CoffeeMachine extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', false)   // observable
    }
    turnOn () {
        this.status = 'ready'
        // Include some messages logged on the console!
        console.log('coffe machine is ready')
    }
    turnOff () {
        this.status = 'not_ready'
        // Include some messages logged on the console!
        console.log('coffe machine is off')
    }
    updateConsumption (Clock) {
        if (this.status) {
            var elapsed_hours = this.Clock.hh - this.start_hh
            var elapsed_mins = 0
            if (this.Clock.hh > this.start_hh) {
                elapsed_mins = 60 - this.start_mm + this.Clock.mm
            } else {
                elapsed_mins = this.Clock.mm - this.start_mm
            }
            // update total energy consumption
            this.house.utilities.electricity += this.consumption*elapsed_hours + ((this.consumption/60)*elapsed_mins)
            // reset time to current Clock time
            this.start_hh = this.Clock.hh
            this.start_mm = this.Clock.mm
        }
    }
}



module.exports = CoffeeMachine