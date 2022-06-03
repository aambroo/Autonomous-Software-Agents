const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Intention = require('../bdi/Intention')
const Goal = require('../bdi/Goal');
const Clock = require('../utils/Clock');


class FakeAction extends pddlActionIntention{

    async checkPreconditionAndApplyEffect () {
        if ( this.checkPrecondition() ) {
            await Clock.global.notifyChange('mm', 'minutes')
            this.applyEffect()
        }
        else
            throw new Error('pddl precondition not valid'); //Promise is rejected!
    }

}

class Suck extends FakeAction {
    static parameters = ['r', 'x'];
    static precondition = [ ['robot', 'r'], ['room', 'x'] ,['dirty', 'x'], ['cleaner-at', 'r', 'x']];
    static effect = [['cleaned', 'x']];
    *exec ({r,x}=parameters) {     // the action is direcly applied to the belief state
        yield this.checkPreconditionAndApplyEffect()
        this.agent.beliefs.declare('cleaned' + ' ' + x), this.agent.beliefs.undeclare('dirty ' + x)
    }
}

class MoveUp extends FakeAction {
    static parameters = ['r', 'x', 'y'];
    static precondition = [ ['robot', 'r'], ['room', 'x'], ['room', 'y'] , ['above', 'x', 'y'], ['cleaner-at', 'r', 'y'], ['region_clear', 'x']];
    static effect = [['cleaner-at', 'r', 'x'], ['region_clear', 'y'], ['not cleaner-at', 'r', 'y']];
    *exec ({r,x,y}=parameters) { // this.goal.parameters we find a map --> parameter order matters
        yield this.checkPreconditionAndApplyEffect()
        this.agent.beliefs.declare('cleaner-at' +  ' ' + r + ' ' + x), this.agent.beliefs.declare('region_clear ' + y), this.agent.beliefs.undeclare('cleaner-at ' + r + ' ' + y)
    } 
}

class MoveDown extends FakeAction {
    static parameters = ['r', 'x', 'y'];
    static precondition = [['robot', 'r'], ['room', 'x'], ['room', 'y'], ['below', 'x', 'y'], ['cleaner-at', 'r', 'y'], ['region_clear', 'x']];
    static effect = [['cleaner-at', 'r', 'x'], ['region_clear', 'y'], ['not cleaner-at', 'r', 'y']];
    *exec ({r,x,y}=parameters) {
        yield this.checkPreconditionAndApplyEffect()
        this.agent.beliefs.declare('cleaner-at' + ' ' + r + ' ' + x ), this.agent.beliefs.declare('region_clear ' + y), this.agent.beliefs.undeclare('cleaner-at ' + r + ' ' + y)
    }
}

class MoveLeft extends FakeAction {
    static parameters = ['r', 'x', 'y'];
    static precondition = [ ['robot', 'r'], ['room', 'x'], ['room', 'y'], ['left', 'x', 'y'], ['cleaner-at', 'r', 'y'], ['region_clear', 'x']];
    static effect = [['cleaner-at', 'r', 'x'], ['region_clear', 'y'], ['not cleaner-at', 'r', 'y']];
    *exec ({r,x,y}=parameters) {
        yield this.checkPreconditionAndApplyEffect()
        this.agent.beliefs.declare('cleaner-at' + ' ' + r + ' ' + x), this.agent.beliefs.declare('region_clear ' + y), this.agent.beliefs.undeclare('cleaner-at ' + r + ' ' + y)
    }
}


class MoveRight extends FakeAction {
    static parameters = ['r', 'x', 'y'];
    static precondition = [ ['robot', 'r'], ['room', 'x'], ['room', 'y'], ['right', 'x', 'y'], ['cleaner-at', 'r', 'y'], ['region_clear', 'x']];
    static effect = [['cleaner-at', 'r', 'x'], ['region_clear', 'y'], ['not cleaner-at', 'r', 'y']];
    *exec ({r,x,y}=parameters) {
        //yield world.MoveRight({x: x, y: y})
        yield this.checkPreconditionAndApplyEffect()
        this.agent.beliefs.declare('cleaner-at' + ' ' +  r + ' ' + x), this.agent.beliefs.declare('region_clear ' + y), this.agent.beliefs.undeclare('cleaner-at ' + r + ' ' + y)
    }
}

class EmptyTrash extends FakeAction{
    // r = robot
    // x = room 
    // t = trash bag
    static parameters = ['r', 'x', 't'];
    static precondition = [['robot', 'r'], ['room', 'x'], ['trash-bag', 't'], ['cleaner-at', 'r', 'x'], ['full', 't']];
    static effect = [['empty', 't']];
    *exec({t}=parameters) {
        yield this.checkPreconditionAndApplyEffect()
        this.agent.beliefs.declare('empty ' + t), this.agent.beliefs.undeclare('full ' + t)
    }
}

// class FullTrash extends FakeAction{
//     // r = robot
//     // x = room 
//     // t = trash bag
//     static parameter