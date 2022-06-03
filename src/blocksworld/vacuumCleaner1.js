const Intention = require('../bdi/Intention')
const Agent = require('../bdi/Agent')
const PlanningGoal = require('../pddl/PlanningGoal')
const pddlActionIntention = require('../pddl/actions/pddlActionIntention')



class FakeAction extends pddlActionIntention {

    *exec () {
        for ( let b of this.effect )
            this.agent.beliefs.apply(b)
        yield new Promise(res=>setTimeout(res,100))
        this.log('effects applied')
        // this.log(this.agent.beliefs)
    }

}

class Clean extends FakeAction {

    static parameters = ['room', 'vc']
    static precondition = [ ['is_dirty', 'room'], ['in_room', 'vc', 'room'] ]
    static effect = [ ['not is_dirty', 'room'], ['is_clean', 'room'] ]

}

class Move extends FakeAction {

    static parameters = ['vc', 'src_room', 'dst_room']
    static precondition = [ ['in_room', 'vc', 'src_room'], 
                            ['doors_to', 'src_room', 'dst_room'], 
                            ['not in_room', 'vc', 'dst_room']]
    static effect = [ ['not in_room', 'vc', 'src_room'], ['in_room', 'vc', 'dst_room'] ]

}


// Instantiating VacuumCleaner
var vc = new Agent('vc')
// Room Layout
vc.beliefs.declare('doors_to kitchen livingroom')       
vc.beliefs.declare('doors_to livingroom kitchen')
vc.beliefs.declare('doors_to livingroom entrancehall')
vc.beliefs.declare('doors_to entrancehall livingroom')
vc.beliefs.declare('doors_to entrancehall washroom')
vc.beliefs.declare('doors_to washroom entrancehall')
// VacuumCleaner init Position
vc.beliefs.declare('in_room robot washroom')
// Room State (clean;dirty)
vc.beliefs.declare('is_dirty kitchen')

let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Clean, Move])
vc.intentions.push(OnlinePlanning)
// let {PlanningIntention} = require('../pddl/Blackbox')([PickUp, PutDown, Stack, UnStack])
// vc.intentions.push(PlanningIntention)
console.log('vc entries', vc.beliefs.entries)
console.log('vc literals', vc.beliefs.literals)
vc.postSubGoal( new PlanningGoal( { goal: ['is_clean kitchen'] } ) )



// var blackbox = new Blackbox(new LightOn({l: 'light1'}), './bin/blocks-domain.pddl', './bin/blocks-problem.pddl')
// var blackbox = new Blackbox(vc, new BlocksWorldGoal({ob: 'a'}))
// blackbox.run()
