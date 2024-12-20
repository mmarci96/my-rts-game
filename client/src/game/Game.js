import GameLogic from './logic/GameLogic.js';

class Game {
    #gameLogic;
    /**
	  * An array of string will be the parameter we receive from endpoint/ws
	  * @param { Array<string> } map
	  */
    constructor(map, assets, units, player) {
        this.player = player
        if (!(map instanceof Array)) {
            throw new TypeError('Map loader requires at least one map');
        }
        this.#gameLogic = new GameLogic(map, assets, units, this.player);
    }

    setupPain(){
        this.#gameLogic.setupGame();
    }
    
    refreshUnitData(units) {
        console.log(units)
    }
}

export default Game;
