const Observable =  require('../utils/Observable')

class Room extends Observable{

    constructor (house, name, doors_to, floor, light, temp_sensor){
        super(Room)
        this.house = house
        this.name = name
        this.doors_to = doors_to
        this.floor = floor
        this.temp_sensor = temp_sensor
        this.light = light
        this.set('temperature', 19)
        this.locked = false
    }
    updateTemperature() {
        if (this.temp_sensor.status && !this.temp_sensor.ideal){  
            this.temperature += 1 // increase temperature if not already ideal
        } else {
            this.temperature -= 1 // decrease temprature 
        }
    }
    
}

module.exports = Room