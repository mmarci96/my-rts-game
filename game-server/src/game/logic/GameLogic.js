const GameMap = require("./GameMap")
const Player = require("../data/Player")
const UnitController = require("./UnitController")
const Unit = require("../data/Unit")

module.exports = class GameLogic {
    #gameMap
    #players
    #unitController
    constructor(units, gameMap){
        this.#players = new Map();
        this.#unitController = new UnitController(units);
        this.#gameMap = new GameMap(gameMap);
        this.commandCount = 0
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
        let winner = null
        const unitSize = this.#unitController.getUnitSize(); 
        this.getPlayers().forEach(({ playerId, color }) => {
            const playerUnits = this.#unitController.getUnitsByColor(color)
            if(unitSize === playerUnits.length){
                winner = { winner: playerId, color: color, points: 2 }
            }
        })
        return winner;
    }

}
