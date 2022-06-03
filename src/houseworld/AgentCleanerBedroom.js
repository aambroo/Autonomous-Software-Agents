//const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Intention = require('../bdi/Intention')
const Goal = require('../bdi/Goal')
const Clock = require('../utils/Clock')
const {Suck, MoveUp, MoveDown, MoveLeft, MoveRight, RetryGoal, RetryFourTimesIntention} = require('./CleanerActions');
const PlanningGoal = require('../pddl/PlanningGoal')


class VacuumBedroomGoal extends Goal{
    constructor(vacuum_cleaner, house){
        super()
        this.vacuum_cleaner = vacuum_cleaner 
        this.house = house
    }
}


class VacuumBedroomIntention extends Intention{
    constructor(agent,goal){
        super(agent,goal)
        this.vacuum_cleaner = this.goal.vacuum_cleaner
        this.house = this.goal.house
    }

    static applicable(goal){
        return goal instanceof VacuumBedroomGoal;
    }

    *exec(){
        // the bedroom is intended as a maze composed by 4 areas
        // this robot, since the room is pretty small, has no motor controllers
        this.vacuum_cleaner.beliefs.declare('room upper_left_bedroom')
        this.vacuum_cleaner.beliefs.declare('room upper_right_bedroom') 
        this.vacuum_cleaner.beliefs.declare('room lower_left_bedroom')
        this.vacuum_cleaner.beliefs.declare('room lower_right_bedroom') 

        this.vacuum_cleaner.beliefs.declare('robot cleaner')

        this.vacuum_cleaner.beliefs.declare('cleaner-at cleaner upper_left_bedroom')

        this.vacuum_cleaner.beliefs.declare('above upper_left_bedroom lower_left_bedroom')
        this.vacuum_cleaner.beliefs.declare('above upper_right_bedroom lower_right_bedroom')
        // this.vacuum_cleaner.beliefs.declare('below lower_left_bedroom upper_left_bedroom') // this is ommited to avoid the vacuum takes wrong paths
        this.vacuum_cleaner.beliefs.declare('below lower_right_bedroom upper_right_bedroom')

        this.vacuum_cleaner.beliefs.declare('right upper_right_bedroom upper_left_bedroom')
        this.vacuum_cleaner.beliefs.declare('right lower_right_bedroom lower_left_bedroom')
        this.vacuum_cleaner.beliefs.declare('left upper_left_bedroom upper_right_bedroom') 
        this.vacuum_cleaner.beliefs.declare('left lower_left_bedroom lower_right_bedroom') 
        
        this.vacuum_cleaner.beliefs.declare('region_clear upper_right_bedroom')
        this.vacuum_cleaner.beliefs.declare('region_clear lower_right_bedroom')
        this.vacuum_cleaner.beliefs.declare('region_clear lower_left_bedroom')

        var {OnlinePlanning} = require('../pddl/OnlinePlanner')([MoveUp, MoveDown, MoveLeft, MoveRight])

        this.vacuum_cleaner.intentions.push(OnlinePlanning)
        this.vacuum_cleaner.intentions.push(RetryFourTimesIntention)

        let promise = new Promise(async res => {
                    while(true){
                        var isResolved = false
                        var isResolved2 = false
                        await Clock.global.notifyChange('hh', 'bedroom');
                        if(Clock.global.hh == 10){ 
                            this.vacuum_cleaner.switchOn()
                            var myPromise = this.vacuum_cleaner.postSubGoal(new RetryGoal ({goal :new PlanningGoal({goal:['cleaner-at cleaner lower_left_bedroom']})}))
                            myPromise.then(() => isResolved = true)
                        }
                        if (isResolved){
                            var myPromise2 = this.vacuum_cleaner.postSubGoal(new RetryGoal ({goal : new PlanningGoal({goal:['cleaner-at cleaner upper_left_bedroom']})}))
                            myPromise2.then(() => {
                                isResolved2 = true
                                //this.house.rooms['kitchen'].cleaned = true
                                this.house.cleanRoom('bedroom')
                            })
                        }
                        if (isResolved2){
                            this.vacuum_cleaner.switchOff()
                        }
                    }
                })
            yield promise
        }
}


module.exports = {VacuumBedroomGoal, VacuumBedroomIntention}