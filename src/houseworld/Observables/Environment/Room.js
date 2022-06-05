const Observable = require('../../../utils/Observable')

class Room extends Observable {
    constructor (name, doors_to, level, devices) {
        super({name: name} );

        this.name = name;
        this.doors_to = doors_to;
        this.level = level;
        this.devices = {};
    }

    // Helper Functions
    getName () {
        return this.name;
    }
    getLevel () {
        return this.level;
    }
    getDoorsToList () {
        return this.doors_to;
    }
    getDoorsTo (doors_to) {
        for (let i = 0; i < this.doors_to.length; i++) {
            if (this.doors_to[i] === doors_to)
                return i;
        }
        return -1;
    }
    getDeviceList () {
        return this.devices;
    }
    getDevice (device) {
        if (this.devices[device])
            return this.devices[device];

        return new Object();
    }
    updateTemperature () {
        if (this.devices.thermostats.status && ! this.devices.thermostats.ideal)
            this.devices.temperature += 1;
        else
            this.devices.temperature -= 1;
    }

}

module.exports = Room;