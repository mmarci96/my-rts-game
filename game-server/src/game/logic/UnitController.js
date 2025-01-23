const Unit = require("../data/Unit")

module.exports = class UnitController {
    #units

    constructor(units){
        this.#units = new Map();
        this.loadUnits(units)
        this.timePassed = 0;
    }

    #handleDeath(deltaTime,unit){
        const isDead = unit.death(deltaTime);    
        if(isDead){
            unit.setState('delete')
        }
    }
    getUnitsByColor(color){
        return [ ...this.#units.values()]
            .filter(unit => unit.getColor() === color)
    }
    getUnitSize(){
        return this.#units.size;
    }
    refreshUnits(deltaTime){
        [...this.#units.values()].forEach(unit => {
            if(!(unit instanceof Unit)){
                throw new TypeError('Not a valid unit, cant refresh!')
            }
            if(unit.getHealth() <= 0){
                unit.setState('dead');
                this.#handleDeath(deltaTime, unit)
            }
            let state = unit.getState();
            switch (state) {
                case 'attack':
                    this.handleAttack(unit, deltaTime);
                    break;               
                case 'moving':
                    unit.updatePosition(deltaTime);
                    break;
                case 'cooldown':
                    unit.updateAttackCooldown(deltaTime)
                    break;
                case 'idle':
                    unit.idleTime += deltaTime;
                    if(unit.idleTime > 1)break;
                    this.adjustIdleUnitPosition(unit);
                    break;
                case 'delete':
                    console.log('deleting')
                    this.#units.delete(unit.getId().toString())
                    break;
                default:
                    break;
            }
        })
    }

    handleMovement(unit, deltaTime){
        if (unit.getTargetId() !== null) {
            const targetUnit = this.#units.get(unit.getTargetId())
            unit.setTarget(targetUnit.getX(), targetUnit.getY())
        }
        unit.updatePosition(deltaTime)
    }

    handleAttack(unit){
        if(!(unit instanceof Unit))throw new TypeError('Unit type bad!');

        const targetId = unit.damageDealer.getTargetId();
        const targetUnit = this.getUnitById(targetId);
        if(!targetUnit){
            unit.setState('idle');
            return;
        }
        const dx = targetUnit.getX() - unit.getX()
        const dy = targetUnit.getY() - unit.getY()
        const distance = Math.sqrt(dx*dx + dy*dy);
        const attackRange = 1.2; 
        if(distance <= attackRange){
            unit.attackUnit(targetUnit);
        } else {
            const directionX = dx / distance; // Normalize the direction vector
            const directionY = dy / distance;

            const targetX = targetUnit.getX() - directionX * (attackRange-0.1);
            const targetY = targetUnit.getY() - directionY * (attackRange-0.1);
            // Set the unit's state and move it towards the calculated position
            unit.setState('moving');
            unit.movable.setTarget(targetX, targetY);
        }
    }

    /**
    * Adjusts the position of idle units to avoid overlap with other idle units at the target position.
    * @param {Unit} idleUnit - The unit that needs position adjustment.
    */
    adjustIdleUnitPosition(idleUnit) {
        const unitsArray = [...this.#units.values()];
        const bufferDistance = 1;

        unitsArray.forEach(otherUnit => {
            if (idleUnit === otherUnit || otherUnit.getState() !== 'idle') return;

            const dx = otherUnit.getX() - idleUnit.getX();
            const dy = otherUnit.getY() - idleUnit.getY();
            const distance = Math.sqrt(dx ** 2 + dy ** 2);

            if (distance < bufferDistance) {
                // Units are too close; adjust position of the idleUnit slightly
                const overlap = bufferDistance - distance;

                // Calculate normalized direction vector
                const directionX = dx / distance || (Math.random() - 0.5);
                const directionY = dy / distance || (Math.random() - 0.5);

                // Move the idle unit slightly away
                idleUnit.setX(idleUnit.getX() - directionX * overlap);
                idleUnit.setY(idleUnit.getY() - directionY * overlap);

            }
        });
    }

    checkForOverlaps() {
        const unitsArray = [...this.#units.values()];
        const minDistance = 1.2; // Minimum allowed distance between units.

        for (let i = 0; i < unitsArray.length; i++) {
            const unitA = unitsArray[i];

            for (let j = i + 1; j < unitsArray.length; j++) {
                const unitB = unitsArray[j];

                const dx = unitB.getX() - unitA.getX();
                const dy = unitB.getY() - unitA.getY();
                const distance = Math.sqrt(dx ** 2 + dy ** 2);

                if (distance < minDistance) {
                    // Units are overlapping; adjust their targets to avoid overlap
                    const angleA = Math.random() * Math.PI * 2; // Randomize directions
                    const angleB = Math.random() * Math.PI * 2;

                    unitA.movable.setTarget(
                        unitA.getX() + Math.cos(angleA) * minDistance,
                        unitA.getY() + Math.sin(angleA) * minDistance
                    );
                    unitB.movable.setTarget(
                        unitB.getX() + Math.cos(angleB) * minDistance,
                        unitB.getY() + Math.sin(angleB) * minDistance
                    );

                }
            }
        }
    }   

    loadUnits(units){
        units.forEach(unit => {
            const createUnit = new Unit({
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
                createUnit.getId().toString(), createUnit
            )
        });
    }

    /*
    * @returns { Unit } 
    */
    getUnitById(unitId){
        return this.#units.get(unitId)    
    }

    getUnits(){
        return [...this.#units.values()]
            .filter(unit => unit.getState() !== 'delete')
            .flatMap(unit => ({
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

}
