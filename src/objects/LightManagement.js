const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock =  require('../utils/Clock');

class LightManagementGoal extends Goal {

    constructor (lights= []) {
        super()
        this.lights = lights
    }

}

class LightManagementIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        this.lights = this.goal.lights
        this.Clock = Clock.global
    }
    
    static applicable (goal) {
        return goal instanceof LightManagementGoal
    }

    *exec () {
        var lightsGoals = []
        for (let l of this.lights) {       
            let lightGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await this.agent.beliefs.notifyChange('movement detected in room', l.room)
                    if (status){
                        l.switchOn()
                    } else {
                        l.switchOff()
                    }
                }
            });

            lightsGoals.push(lightGoalPromise)
        }
        yield Promise.all(lightsGoals)
    }

}

module.exports = {LightManagementGoal, LightManagementIntention}