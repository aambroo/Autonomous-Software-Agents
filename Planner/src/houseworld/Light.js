const Observable = require('../utils/Observable');
const Clock = require('../utils/Clock');



class Light extends Observable {
    constructor (house, room) {
        super(Light)
        this.house = house;         // reference to the house
        this.room = room;           // non-observable
        this.start_mm = 0
        this.start_hh = 0
        this.set('status', false)   // observable
        this.consumption = 1000
        this.Clock = Clock.global
    }
    switchOn () {
        if (!this.status) {
            this.status = true
            console.log(this.room + ' light switched on')
        } else {
            console.log(this.room + ' light already switched on')
        }
        this.start_hh = Clock.global.hh
        this.start_mm = Clock.global.mm
        
    }
    switchOff () {
        if (this.status) {
            this.updateConsumption()
            this.status = true
            console.log(this.room + ' light switched off')
        } else {
            console.log(this.room + ' light already switched off')
        }
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



module.exports = Light