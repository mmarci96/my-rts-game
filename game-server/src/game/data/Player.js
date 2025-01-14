module.exports = class Player {
    #playerId
    #color
    constructor(playerId, color){
        this.#playerId = playerId
        this.#color = color
    }

    getId(){
        return this.#playerId;
    }

    getColor(){
        return this.#color;
    }
}
