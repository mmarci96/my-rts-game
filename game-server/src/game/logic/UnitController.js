const Unit = require("../data/Unit")

module.exports = class UnitController {
    #units
    constructor(){
        this.#units = new Map();
    }

    refreshUnits(){
        this.#units.forEach(unit => {
            if(unit.getState() === 'moving'){
                
            }
        })
    }

    loadUnits(units){
        units.forEach(unit => {
            const creteUnit = new Unit({
                unitId:unit["_id"], 
                x: unit["x"], 
                y: unit["y"],
                color: unit["color"],
                state: unit["state"],
                health: unit["health"],
                speed: unit["speed"],
                type: unit["type"]
            })
            this.#units.set(
                creteUnit.getId().toString(), creteUnit
            )
});
    }

    getUnitById(unitId){
        return this.#units.get(unitId)    
    }

    getUnits(){
        return [...this.#units.values()].flatMap(unit => ({
            id: unit.getId(),
            x: unit.getX(),
            y: unit.getY(),
            color: unit.getColor(),
            state: unit.getState(),
            health: unit.damagable.getHealth(),
            speed: unit.movable.getSpeed(),
            targetX: unit.movable.getTargetX(),
            targetY: unit.movable.getTargetY(),
            type: unit.getType()
        }));
    }

    handleMoving(unit){
        const x = unit.getX()
        const y = unit.getY()
        const speed = unit.getSpeed()

        const { targetX, targetY } = unit.getTarget();
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx**dx + dy**dy)
        if(distance <= speed){

        }
    }
    updateUnitPositions(){
        [...this.#units.values()].forEach(unit => {
           if(unit.getState() === 'moving'){
                unit.move();
            } 
        })
    }
}
