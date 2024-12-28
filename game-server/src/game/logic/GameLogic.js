const GameMap = require("./GameMap")
const Player = require("../data/Player")
const Unit = require("../data/Unit")

module.exports = class GameLogic {
    #gameMap
    #players
    #units
    constructor(){
        this.#players = new Map();
        this.#units = new Map();
    }

    loadUnits(units){
        units.forEach(unit => {
            const creteUnit = new Unit({
                unitId:unit["_id"], 
                x: unit.x, 
                y: unit.y,
                color: unit["color"],
            })
            this.#units.set(
                creteUnit.getId(), creteUnit
            )
        });
    }

    getUnitById(unitId){
        const unit = this.#units.get(unitId)
        return {
            id: unit.getId(),
            x: unit.getX(),
            y: unit.getY(),
            color: unit.getColor()
        }
    }

    getUnits(){
        console.log(this.#units)
        return [...this.#units.values()].flatMap(unit => ({
            id: unit.getId(),
            x: unit.getX(),
            y: unit.getY(),
            color: unit.getColor()
        }));
            
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
