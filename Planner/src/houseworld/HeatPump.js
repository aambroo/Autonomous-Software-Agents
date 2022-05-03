const Observable =  require('../utils/Observable');
const Clock =  require('../utils/Clock');

class HeatPump extends Observable{

    constructor(house) {
        super(HeatPump)
        this.house = house
        this.temperature = 19
        this.ideal = false
        this.startHour = 0
        this.startMins = 0
        this.consumption = 700
        this.set('status', false)
    }

    turnOn(){
        if (!this.status) {
            this.status = true
            console.log(this.room.name, "AC on")
        }
        else{
            console.log(this.room.name, "AC already on")
        }
    }

    turnOff(){
        if (this.status) {
            this.status = true
            console.log(this.room, "AC off")
        }
        else{
            console.log(this.room, "AC already off")
        }
    }

    computeElecricityConsumption(Clock){
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

module.exports = HeatPump