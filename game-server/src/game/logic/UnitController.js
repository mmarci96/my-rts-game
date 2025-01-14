const Unit = require("../data/Unit")

module.exports = class UnitController {
    #units
    constructor(){
        this.#units = new Map();
    }

    refreshUnits(){
        this.#units.forEach(unit => {
            let state = unit.getState();
            switch (state) {
                case 'moving':
                    this.handleMoving(unit);
                    break;
                case 'attack':
                    this.handleAttack(unit);
                default:
                    break;
            }
        })
    }

    handleAttack(unit){
        if(!(unit instanceof Unit))throw new TypeError('Unit type bad!');
        const targetId = unit.damageDealer.getTargetId();
        const targetUnit = this.getUnitById(targetId);
        console.log('Target id: ', targetId);
        console.log('Targeting unit: ',targetUnit);
        if(targetUnit.getHealth() <= 0){
            unit.setState('idle');
            this.#units.delete(targetId);
        }

        const dx = targetUnit.getX() - unit.getX();
        const dy = targetUnit.getY() - unit.getY();
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance <= 1.6){
            const attackDirection = calculateAttackAngle(dx,dy);
            unit.setState(attackDirection);
            unit.attackUnit(targetUnit);
        } else {
            this.handleMoving(unit)    
        }
    }
    calculateAttackAngle(dx,dy){
        const angle = Math.atan2(dy, dx); // Angle between -π and π
        let attackDirection = '';

        // Determine direction based on angle
        if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) {
            attackDirection = 'attackRight'; // Facing right
        } else if (angle > Math.PI / 4 && angle <= (3 * Math.PI) / 4) {
            attackDirection = 'attackDown'; // Facing down
        } else if (angle > (3 * Math.PI) / 4 || angle <= -(3 * Math.PI) / 4) {
            attackDirection = 'attackLeft'; // Facing left
        } else if (angle > -(3 * Math.PI) / 4 && angle <= -Math.PI / 4) {
            attackDirection = 'attackUp'; // Facing up
        }
        return attackDirection;
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
        if(!(unit instanceof Unit))throw new TypeError('Invalid unit!')
        const x = unit.getX()
        const y = unit.getY()
        const speed = unit.getSpeed()

        const { targetX, targetY } = unit.getTarget();
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx**dx + dy**dy)
        if(distance <= speed){
            unit.setX(targetX);
            unit.setY(targetY);
            unit.movable.setTarget(null,null);
            unit.setState('idle');
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
