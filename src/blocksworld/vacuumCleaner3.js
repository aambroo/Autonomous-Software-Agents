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

    class FakeAction {

        constructor (agent, parameters) {
            this.agent = agent
            this.parameters = parameters
        }

        get precondition () {
            return pddlActionIntention.ground(this.constructor.precondition, this.parameters)
        }
        
        checkPrecondition () {
            return this.agent.beliefs.check(...this.precondition);
        }

        get effect () {
            return pddlActionIntention.ground(this.constructor.effect, this.parameters)
        }

        applyEffect () {
            for ( let b of this.effect )
                this.agent.beliefs.apply(b)
        }

        async checkPreconditionAndApplyEffect () {
            if ( this.checkPrecondition() ) {
                this.applyEffect()
                await new Promise(res=>setTimeout(res,1000))
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


    world.clean = function ({ob, gripper} = args) {
        this.log('clean', ob, gripper)
        return new Clean(world, {ob, gripper} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.clean failed:', err.message || err); throw err;})
    }

    world.move = function ({ob, gripper} = args) {
        this.log('move', ob, gripper)
        return new Move(world, {ob, gripper} ).checkPreconditionAndApplyEffect()
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
            yield world.clean({ob, gripper: this.agent.name})
        }
    }

    class Move extends pddlActionIntention {
        static parameters = ['vc', 'src_room', 'dst_room'];
        static precondition = [ ['in_room', 'vc', 'src_room'], 
                                ['doors_to', 'src_room', 'dst_room'], 
                                ['not in_room', 'vc', 'dst_room']];
        static effect = [ ['not in_room', 'vc', 'src_room'], ['in_room', 'vc', 'dst_room'] ];
        *exec ({ob}=parameters) {
            yield world.move({ob, gripper: this.agent.name})
        }
    }


    class RetryGoal extends Goal {}
    class RetryFourTimesIntention extends Intention {
        static applicable (goal) {
            return goal instanceof RetryGoal
        }
        *exec ({goal}=parameters) {
            for(let i=0; i<4; i++) {
                let goalAchieved = yield this.agent.postSubGoal( goal )
                if (goalAchieved)
                    return;
                this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
                yield this.agent.beliefs.notifyAnyChange()
            }
        }
    }

    var sensor = (agent) => (value,key,observable) => {
        let predicate = key.split(' ')[0]
        let arg1 = key.split(' ')[1]
        let arg2 = key.split(' ')[2]
        if (predicate=='clean')
            if (arg2==agent.name)
                key = 'clean '+arg1; //key.split(' ').slice(0,2).join(' ')
            else
                return;
        else if (predicate=='empty')
            if (arg1==agent.name)
                key = 'empty'
            else
                return;
        value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)
    }
    
    {
        let vc1 = new Agent('vc1')
        // vc1.beliefs.declare('on-table a')
        // vc1.beliefs.declare('on b a')
        // vc1.beliefs.declare('clear b')
        // vc1.beliefs.declare('empty')
        world.beliefs.observeAny( sensor(vc1) )
        // let {PlanningIntention} = require('../pddl/BlackboxIntentionGenerator')([PickUp, PutDown, Stack, UnStack])
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Clean, Move])
        vc1.intentions.push(OnlinePlanning)
        vc1.intentions.push(RetryFourTimesIntention)
        // console.log('vc1 entries', vc1.beliefs.entries)
        // console.log('vc1 literals', vc1.beliefs.literals)
        // vc1.postSubGoal( new PlanningGoal( { goal: ['is_clean kitchen'] } ) ) // by default give up after trying all intention to achieve the goal
        vc1.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['is_clean kitchen'] } ) } ) ) // try to achieve the PlanningGoal for 4 times
    }
    {
        let vc2 = new Agent('vc2')
        // vc2.beliefs.declare('on-table a')
        // vc2.beliefs.declare('on b a')
        // vc2.beliefs.declare('clear b')
        // vc2.beliefs.declare('empty')
        world.beliefs.observeAny( sensor(vc2) )
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Clean, Move])
        vc2.intentions.push(OnlinePlanning)
        vc2.intentions.push(RetryFourTimesIntention)
        // console.log('vc2 entries', vc2.beliefs.entries)
        // console.log('vc2 literals', vc2.beliefs.literals)
        // vc2.postSubGoal( new PlanningGoal( { goal: ['is_clean kitchen'] } ) ) // loop over intentions trying to achieve the goals up to 5 times
        vc2.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['is_clean kitchen'] } ) } ) ) // try to achieve the PlanningGoal for 4 times
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
world.beliefs.declare('in_room vc1 washroom')
world.beliefs.declare('in_room vc2 livingroom')
// Room State (clean;dirty)
world.beliefs.declare('is_dirty kitchen')