const GameMap = require("./GameMap")
const Player = require("../data/Player")
const UnitController = require("./UnitController")
const Unit = require("../data/Unit")
const BuildingController = require("./BuildingController")
const ResourceController = require("./ResourceController")
const Building = require("../data/Building")
const MainBuilding = require("../data/MainBuilding")
const UnitFactory = require("../../service/unitFactory.service")

module.exports = class GameLogic {
    #gameMap
    #players
    #unitController
    #buildingController
    #resourceController

    constructor(units, gameMap, resources, buildings, sessionId){
        this.sessionId = sessionId;
        this.refreshRate = 0
        const unitFactory = async (unitType, props) => {
            if (unitType === 'warrior') {
                return await UnitFactory.createWarrior({ ...props })
            }
            if (unitType === 'worker') {
                return await UnitFactory.createWorker({ ...props })
            }
            return null;
        }
        this.#players = new Map();
        this.#unitController = new UnitController(units);
        this.#buildingController = new BuildingController(buildings, unitFactory)
        this.#resourceController = new ResourceController(resources)
        this.#gameMap = new GameMap(gameMap);
        this.commandCount = 0
    }

    getResources(){
        return this.#resourceController.getResources()
    }

    getBuildings(){
        return this.#buildingController.getBuildings();
    }

    getUnits(){
        return this.#unitController.getUnits();
    }

    updateUnits(deltaTime){
        this.#unitController.refreshUnits(deltaTime);
    }

    updateBuildings(deltaTime){
        const stagger = 30;
        if(this.refreshRate <= stagger){
            this.refreshRate++
            return
        }
        this.refreshRate = 0;
        this.#buildingController.refreshBuilding(deltaTime);
    }
    
    handleCommand(command){
        this.commandCount++
        const { action, unitId, buildingId } = command;
        const unit = this.#unitController.getUnitById(unitId)
        const building = this.#buildingController.getBuildingById(buildingId)
        if(!unit && !building) {
            console.error('unit not found, command cannot resolve');
            return;
        }
        if(unit && !(unit instanceof Unit)) throw new TypeError('Invalid unit');
        if(building && !(building instanceof Building)) throw new TypeError('Invalid building');
        switch (action) {
            case 'moving':
                unit.movable.setTarget(command.targetX, command.targetY)
                break;
            case 'attack':
                const { targetId } = command;
                unit.damageDealer.setTargetId(targetId);
                unit.setState(action)
                break;
            case 'train':
                if(!(building instanceof MainBuilding)) throw new TypeError("not main")
                building.trainUnit(command.unitType);
                building.setState('training')
                break
            default:
                console.error("no action recognized");
                
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
