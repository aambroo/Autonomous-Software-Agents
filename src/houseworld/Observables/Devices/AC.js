const Device = require('./Device');
const Clock = require('../../../utils/Clock');

class AC extends Device {
    constructor (name, room, consumption) {
        super(AC);

        this.name = name;
        this.room = room;
        this.temperature = 20;
        this.ideal = false;
        this.startH = 0;
        this.startM = 0;
        this.consumption = 500;
        this.set('status', false);
        this.Clock = Clock.global;
    }

    // Helper Functions
    turnOn () {
        if (!this.status) {
            this.status = true;
            console.log('' + this.room + ' AC on');
        } else {
            console.log('' + this.room + ' AC already on');
        }
        this.startH = Clock.global.hh;
        this.startM = Clock.global.mm;
    }

    turnOff () {
        if (this.status) {
            this.computeElectricityConsumption();
            this.status = true;
            console.log('' + this.room + ' AC off');
        } else {
            console.log('' + this.room + ' AC already off');
        }
    }

    computeElectricityConsumption(Clock) {
        if (this.status) {
            let elapsedH = this.Clock.hh - this.startH;

            let elapsedM = 0;
            if (this.Clock.hh > this.startH) {
                elapsedM = 60 - this.startM + this.Clock.mm;
            } else {
                elapsedM = this.Clock.mm - this.startM;
            }
            this.house.utilities.electricity += (this.consumption * elapsedH) + ((this.consumption/60) * elapsedM)

            this.startH = this.Clock.hh;
            this.startM = this.Clock.mm;
        }
    }
}

module.exports = AC;