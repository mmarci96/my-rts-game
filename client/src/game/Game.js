/** @format */

import GameLogic from './logic/GameLogic.js';

class Game {
    #gameLogic;
    /**
	  * An array of string will be the parameter we receive from endpoint/ws
	  * @param { Array<string> } map
	  */
    constructor(map, assetManager) {
        if (!(map instanceof Array)) {
            throw new TypeError('Map loader requires at least one map');
        }
        this.#gameLogic = new GameLogic(map, assetManager);
    }

    loadMap(){
        this.#gameLogic.loadMap();
    }
    loadGame(units) {
        this.#gameLogic.loadStart(units)
    }
}

export default Game;
