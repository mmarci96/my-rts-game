const GameMap = require("./GameMap")
const Player = require("../data/Player")
const UnitController = require("./UnitController")
const Unit = require("../data/Unit")

module.exports = class GameLogic {
    #gameMap
    #players
    #unitController
    constructor(){
        this.#players = new Map();
        this.#unitController = new UnitController;
        this.commandCount = 0
    }

    loadUnits(units){
        this.#unitController.loadUnits(units)
    }
    getUnits(){
        return this.#unitController.getUnits();
    }
    updateUnits(deltaTime){
        this.#unitController.refreshUnits(deltaTime);
    }
    
    handleCommand(command){
        console.log(this.commandCount)
        console.log(command);
        this.commandCount++
        const { action, unitId } = command;
        const unit = this.#unitController.getUnitById(unitId)
        if(!(unit instanceof Unit)) throw new TypeError('Invalid unit');
        if(!unit) {
            console.log('unit not found, command cannot resolve');
            return;
        }
        switch (action) {
            case 'moving':
                unit.movable.setTarget(command.targetX, command.targetY)
                break;
            case 'attack':
                const { targetId } = command;
                unit.damageDealer.setTargetId(targetId);
                unit.setState(action)
                break;   
        }
        unit.setState(action);

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
    getPlayers(){
        return [...this.#players.values()].flatMap(player => ({
            playerId: player.getId(),
            color: player.getColor()
        }))
    }
    removePlayerById(playerId){
        this.#players.delete(playerId)
    }
    getPlayerById(playerId){
        return this.#players.get(playerId);
    }

}
