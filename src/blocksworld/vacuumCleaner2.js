const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')



/**
 * World agent
 */
const world = new Agent('world');
{

    class FakeAction extends pddlActionIntention {

        async checkPreconditionAndApplyEffect () {
            if ( this.checkPrecondition() ) {
                this.applyEffect()
                await new Promise(res=>setTimeout(res,1000))
                // this.log('effects applied')
            }
            else
                throw new Error('pddl precondition not valid'); //Promise is rejected!
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


    world.clean = function ({ob} = args) {
        return new Clean(world, new Goal({ob}) ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.clean failed:', err.message || err); throw err;})
    }

    world.move = function ({ob} = args) {
        return new Move(world, new Goal({ob}) ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.move failed:', err.message || err); throw err;})
    }

}




/**
 * Gripper agents
 */
{
    class Clean extends pddlActionIntention {
        static parameters = ['room', 'vc'];
        static precondition = [ ['is_dirty', 'room'], ['in_room', 'vc', 'room'] ];
        static effect = [ ['not is_dirty', 'room'], ['is_clean', 'room'] ];
        *exec ({ob}=parameters) {
            yield world.clean({ob})
        }
    }

    class Move extends pddlActionIntention {
        static parameters = ['vc', 'src_room', 'dst_room'];
        static precondition = [ ['in_room', 'vc', 'src_room'], 
                                ['doors_to', 'src_room', 'dst_room'], 
                                ['not in_room', 'vc', 'dst_room']];
        static effect = [ ['not in_room', 'vc', 'src_room'], ['in_room', 'vc', 'dst_room'] ];
        *exec ({ob}=parameters) {
            yield world.move({ob})
        }
    }

    class ReplanningIntention extends Intention {
        static applicable (goal) {
            return goal instanceof PlanningGoal
        }
        *exec (parameters) {
            yield new Promise(res=>setTimeout(res,1100))
            yield this.agent.postSubGoal( new PlanningGoal(parameters) )
        }
    }



    {
        let vc1 = new Agent('vc1')
        // vc1.beliefs.declare('on-table a')
        // vc1.beliefs.declare('on b a')
        // vc1.beliefs.declare('clear b')
        // vc1.beliefs.declare('empty')
        world.beliefs.observeAny( (value,key,observable)=>{value?vc1.beliefs.declare(key):vc1.beliefs.undeclare(key)} )
        // let {PlanningIntention} = require('../pddl/BlackboxIntentionGenerator')([Clean, Move, Stack, UnStack])
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Clean, Move])
        vc1.intentions.push(OnlinePlanning)
        vc1.intentions.push(ReplanningIntention)
        // console.log('vc1 entries', vc1.beliefs.entries)
        // console.log('vc1 literals', vc1.beliefs.literals)
        vc1.postSubGoal( new PlanningGoal( { goal: ['is_clean kitchen'] } ) ) // by default give up after trying all intention to achieve the goal
    }
    {
        let vc2 = new Agent('vc2')
        // vc2.beliefs.declare('on-table a')
        // vc2.beliefs.declare('on b a')
        // vc2.beliefs.declare('clear b')
        // vc2.beliefs.declare('empty')
        world.beliefs.observeAny( (value,key,observable)=>{value?vc2.beliefs.declare(key):vc2.beliefs.undeclare(key)} )
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Clean, Move])
        vc2.intentions.push(OnlinePlanning)
        vc2.intentions.push(ReplanningIntention)
        // console.log('a2 entries', a2.beliefs.entries)
        // console.log('a2 literals', a2.beliefs.literals)
        vc2.postSubGoal( new PlanningGoal( { goal: ['is_clean kitchen'] } ) ) // loop over intentions trying to achieve the goals up to 5 times
    }
}


// Room Layout
world.beliefs.declare('doors_to kitchen livingroom')       
world.beliefs.declare('doors_to livingroom kitchen')
world.beliefs.declare('doors_to livingroom entrancehall')
world.beliefs.declare('doors_to entrancehall livingroom')
world.beliefs.declare('doors_to entrancehall washroom')
world.beliefs.declare('doors_to washroom entrancehall')
// VacuumCleaner init Position
world.beliefs.declare('in_room vc washroom')
// Room State (clean;dirty)
world.beliefs.declare('is_dirty kitchen')