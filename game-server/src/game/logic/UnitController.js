const Unit = require("../data/Unit")

module.exports = class UnitController {
    #units
    constructor(){
        this.#units = new Map();
    }

    refreshUnits(deltaTime){
        [...this.#units.values()].forEach(unit => {
            let state = unit.getState();
            switch (state) {
                case 'attack':
                    this.handleAttack(unit, deltaTime);
                    break;               
                case 'moving':
                    unit.move(deltaTime);
                    break;
                default:
                    console.log('state:', unit.getState())
                    console.log('hp: ',unit.damagable.getHealth())
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
        if(targetUnit.damagable.getHealth() <= 0){
            unit.setState('idle');
            this.#units.delete(targetId);
        }
        const dx = targetUnit.getX() - unit.getX();
        const dy = targetUnit.getY() - unit.getY();
        const distance = Math.sqrt(dx*dx + dy*dy);
        const attackRange = 0.4; 
        if(distance <= attackRange){
            const attackDirection = this.calculateAttackAngle(dx,dy);
            unit.setState(attackDirection);
            unit.attackUnit(targetUnit);
        } else {
            unit.setState('moving');
            unit.movable.setTarget(targetUnit.getX(),targetUnit.getY());
        }
    }
    calculateAttackAngle(dx,dy){
        const angle = Math.atan2(dy, dx); // Angle between -π and π
        let attackDirection = '';

        // Determine direction based on angle
        if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) {
            attackDirection = 'attackRight1'; // Facing right
        } else if (angle > Math.PI / 4 && angle <= (3 * Math.PI) / 4) {
            attackDirection = 'attackDown1'; // Facing down
        } else if (angle > (3 * Math.PI) / 4 || angle <= -(3 * Math.PI) / 4) {
            attackDirection = 'attackLeft1'; // Facing left
        } else if (angle > -(3 * Math.PI) / 4 && angle <= -Math.PI / 4) {
            attackDirection = 'attackUp1'; // Facing up
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

}
