import Player from './data/Player.js';
import GameLogic from './logic/GameLogic.js';

class Game {
    #gameLogic;
    /**
    * An array of string will be the parameter we receive from endpoint/ws
    * @param { Array<string> } map
    * @param { Array } units 
    * @param { Map } assets
    * @param { Player } player
    * @param { Function } createCommand 
    */
    constructor(map, assets, player, createCommand) {
        this.player = player
        if (!(map instanceof Array)) {
            throw new TypeError('Map loader requires at least one map');
        }
        this.#gameLogic = new GameLogic(map, assets, this.player, createCommand);
    }
    getCurrentState(){
        const units = this.#gameLogic.getUnitData();
        return units;
    }

    setupPain(){
        this.#gameLogic.setupGame();
    }
    refreshGameData({units, buildings}){    
        this.#gameLogic.updateUnits(units)
        this.#gameLogic.updateBuildings(buildings)
    }

    stopGame(){
        this.#gameLogic.stopGame();
    }
}

export default Game;
