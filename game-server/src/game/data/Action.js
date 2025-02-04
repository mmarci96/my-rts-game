module.exports = class Action {
    constructor({ name, duration, cost }){
        this.name = name;
        this.duration = duration;
        this.cost = cost;
        this.count = 1
    }

    startAction(){
        this.startedAt = Date.now()
    }

    isReady(){
        return (Date.now() - this.createdAt) >= this.duration;
    }

}
