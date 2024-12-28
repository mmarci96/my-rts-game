const GameMap = require("./GameMap")
const Player = require("../data/Player")
const UnitController = require("./UnitController")

module.exports = class GameLogic {
    #gameMap
    #players
    #unitController
    constructor(){
        this.#players = new Map();
        this.#unitController = new UnitController;
    }

    loadPlayers(players){
        players.forEach(player => {
            const createPlayer = new Player(player["userId"], player["color"])
            this.#players.set(createPlayer.getId(), createPlayer)
        });
    }

    loadUnits(units){
        this.#unitController.loadUnits(units)
    }
    getUnits(){
        return this.#unitController.getUnits();
    }

    loadMap(map){
        this.#gameMap = new GameMap(map);
    }

    getMap(){
        return this.#gameMap;
    }

    addPlayer(playerId, color){
        const player = new Player(playerId, color);
        this.#players.set(playerId, player)
    }

    getPlayerById(playerId){
        return this.#players.get(playerId);
    }

}
