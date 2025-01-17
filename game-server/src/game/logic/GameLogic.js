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
        this.#unitController = new UnitController();
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
        this.commandCount++
        const { action, unitId } = command;
        const unit = this.#unitController.getUnitById(unitId)
        if(!unit) {
            console.error('unit not found, command cannot resolve');
            return;
        }
        if(!(unit instanceof Unit)) throw new TypeError('Invalid unit');
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

    getUnitsByPlayer(playerId){
        const player = this.getPlayerById(playerId)
        const color = player.getColor();
        return this.#unitController.getUnits()
           .filter(unit => unit.color === color);
    }

    isGameOver(){
        this.getPlayers().forEach(({ playerId }) => {
            const units = this.getUnitsByPlayer(playerId)
            if (units.length === 0){
                this.removePlayerById(playerId)
            }
        })
        if(this.#players.size === 1){
            return { winner: [...this.#players.values()][0].getId(), points: 2 }
        }
        return null;
    }

}
