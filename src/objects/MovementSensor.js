const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');



class MovementDetectionGoal extends Goal {

    constructor (residents = [], rooms= []) {
        super()
        this.residents = residents
        this.rooms = rooms

    }

}



class MovementDetectionIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        this.residents = this.goal.residents
        this.rooms = this.goal.rooms
    }
    
    static applicable (goal) {
        return goal instanceof MovementDetectionGoal
    }

    *exec () {
        var detectionGoal = []
        for (let p of this.residents) {       
            let detectionGoalPromise = new Promise( async res => {
                while (true) {
                    let room = await p.notifyChange('in_room')
                    this.log('sense: someone in room ' + room)
                    this.agent.beliefs.declare('someone_in_room', room)
                    for (let r of this.rooms){
                        var in_room = false
                        for (let per of this.residents){
                            if (r.name == per.in_room){
                                in_room = true
                            }
                        }
                        if (!in_room){
                            this.agent.beliefs.undeclare('movement detected in room', r.name) 
                        }
                    }
                }
            });
            
            detectionGoal.push(detectionGoalPromise)
        }
        yield Promise.all(detectionGoal)
    }

}

module.exports = {MovementDetectionGoal, MovementDetectionIntention}