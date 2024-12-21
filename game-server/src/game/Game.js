class Game {
    #id
    constructor(gameId){
        this.#id = gameId;
    }
    getId(){
        return this.#id;
    }
}

module.exports = Game
