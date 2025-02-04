const Action = require("./Action");
const Building = require("./Building");

module.exports = class MainBuilding extends Building {
    #pendingActions
    #currentAction
    #readyActions

    constructor({ buildingId, x, y, color, health, type }){
        super({ buildingId, x, y, color, health, type })
        this.#pendingActions = []
        this.#readyActions = []
        this.#currentAction = null;
    }

    trainUnit(type){
        switch (type) {
            case 'warrior':
                const createWarrior = new Action({name:'createWarrior', duration: 3, cost: 100})
                if(!this.#currentAction){
                    this.#pendingActions.push(createWarrior)
                    break;
                }
                createWarrior.startAction();
                this.currentAction = createWarrior
                break;
            case 'worker':
                const createWorker = new Action({name:'createWorker', duration: 3, cost: 50})
                if(!this.#currentAction){
                    this.#pendingActions.push(createWarrior)
                    break;
                }
                createWorker.startAction()
                this.currentAction = createWorker
                break
            default:
                break;
        }
    }

    updateTraining(){
        if(!this.#currentAction.isReady()){
            return
        }

        this.#readyActions.push(this.#currentAction)

        if (this.#pendingActions.length >= 1) {
            this.currentAction = this.#pendingActions.shift()
            this.currentAction.startAction();
        }
    }

    getFinishedActions(){
        return this.#readyActions
    }

}
