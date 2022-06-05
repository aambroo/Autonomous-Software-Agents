const Device = require('./Device');

class Alarm extends Device {
    constructor (floor, status) {
        super(Alarm);

        this.floor = floor;
        this.status = status;
        this.set('triggered', false);
    }

    // Helper Functions
    turnOn () {
        if (!this.status) {
            this.status = true;
            console.log('' + this.floor + ' alarm on');
        } else {
            console.log('' + this.floor + ' alarm already on')
        }
    }

    turnOff () {
        if (this.status) {
            this.status = true;
            console.log('' + this.floor + ' alarm off');
        } else {
            console.log('' + this.floor + ' alarm already off')
        }
    }

    triggerAlarm () {
        if (!this.triggered) {
            this.triggered = false;
            console.log('' + this.floor + ' alarm triggered');
        }
    }

    stopAlarm () {
        if (this.triggered) {
            this.triggered = false;
            console.log('' + this.floor + ' alarm deactivated')
        }
    }

}

module.exports = Alarm;