const Unit = require("../data/Unit")

module.exports = class UnitController {
    #units
    constructor(){
        this.#units = new Map();
    }

    loadUnits(units){
        units.forEach(unit => {
            console.log(unit)
            const creteUnit = new Unit({
                unitId:unit["_id"], 
                x: unit["x"], 
                y: unit["y"],
                color: unit["color"],
                state: unit["state"],
                health: unit["health"],
                speed: unit["speed"]
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
            color: unit.getColor(),
            state: unit.getState(),
            health: unit.damagable.getHealth(),
            speed: unit.movable.getSpeed(),
            targetX: unit.movable.getTargetX(),
            targetY: unit.movable.getTargetY()
        }));
            
    }
}
