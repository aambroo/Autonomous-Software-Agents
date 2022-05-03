const Observable =  require('../utils/Observable')
const Clock =  require('../utils/Clock')

class AntiIntrusionAlarm extends Observable{
    
    constructor (house, floor, status) {
        super(AntiIntrusionAlarm)
        this.house = house
        this.floor = floor
        this.status = status
        this.set('triggered', false)
        this.start_hh = 0
        this.start_mm = 0
        this.consumption = 60
    }

    turnOn(){
        if (!this.status) {
            this.status = true
            console.log(this.floor, "alarm on")
        }
        else{
            console.log(this.floor, "alarm already on")
        }
        this.start_hh = Clock.global.hh
        this.start_mm = Clock.global.mm
    }

    turnOff(){
        if (this.status) {
            this.updateConsumption()
            this.status = true
            console.log("" + this.floor + " alarm off")
        }
        else{
            console.log("" + this.floor + " alarm already off")
        }
    }

    triggerAlarm(){
        if (!this.emergency) {
            this.emergency = true
            console.log("Alarm at " + this.floor + " floor has been activated")
        } else {
            console.log("Alarm at " + this.floor + " floor was already active")
        }
        this.house.utilities.electricity += 1000
    }

    stopAlarm(){
        if (this.emergency) {
            this.emergency = false
            console.log("Alarm at " + this.floor + " floor has been deactivated")
        } else {
            console.log("Alarm at " + this.floor + " floor was not active")
        }
    }

    updateConsumption(){
        if (this.status){
            let elapsed_h = Clock.global.hh - this.start_hh
            let elapsed_m = 0
            if (Clock.global.hh > this.start_hh){
                elapsed_m = 60 - this.start_mm + Clock.global.mm
            } else {
                elapsed_m = Clock.global.mm - this.start_mm
            }
            this.house.utilities.electricity += this.consumption*elapsed_h + ((this.consumption/60)*elapsed_m) // update house energy consumption
            // reset time keeper
            this.start_hh = Clock.global.hh
            this.start_mm = Clock.global.mm
        }   
    }
    
}

module.exports = AntiIntrusionAlarm