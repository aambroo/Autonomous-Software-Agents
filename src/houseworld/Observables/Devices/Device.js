const Observable = require('../../../utils/Observable')

class Device extends Observable {
    constructor (name, status, consumption) {
        super({name: name, status: status} );

        this.name = name;
        this.status = status;
        this.consumption = consumption;
        this.set('tot_consumption', 0);
    }

    // Helper Functions
    getName () {
        return this.name;
    }

    getStatus () {
        return this.status;
    }

    setStatus (status) {
        this.status = status;
    }

    getTotalConsumption () {
        return this.tot_consumption;
    }

    resetTotalConsumption () {
        this.tot_consumption = 0;
    }
}

module.exports = Device;