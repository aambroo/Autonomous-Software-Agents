const Observable = require('../utils/Observable');



class CoffeeMachine extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', false)   // observable
    }
    turnOn () {
        this.status = 'ready'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log('coffe machine is ready')
    }
    turnOff () {
        this.status = 'not_ready'
        this.house.utilities.electricity.consumption -= 0;//1;
        // Include some messages logged on the console!
        console.log('coffe machine is off')
    }
}



module.exports = CoffeeMachine