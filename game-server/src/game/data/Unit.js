const GameEntity = require('./GameEntity')
const Movable = require('./Movable')
const Damagable = require('./Damagable')
const DamageDealer = require('./DamageDealer')

module.exports = class Unit extends GameEntity {
    static #unitBaseAttack = 2;
    constructor({ unitId, x, y, color, state, health, speed, type, attackDmg }){
        super({unitId, x, y, color, state, type})
        this.movable = new Movable(speed)
        this.damagable = new Damagable(health)
        let dmg = attackDmg;
        if(!dmg) dmg = Unit.#unitBaseAttack;
        this.damageDealer = new DamageDealer(dmg)
    }
    move(){
        const tx = this.movable.getTargetX()
        const ty = this.movable.getTargetY()
        const dx = tx - super.getX()
        const dy = ty - super.getY()
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = this.movable.getSpeed()/32;
        console.log('distance', distance)
        if(distance <= 0.4){
            super.setX(tx);
            super.setY(ty);
            super.setState('idle');
            this.movable.resetTarget();
        }else if(distance < speed){

        } else {
            const nx = dx / distance; // Normalized x direction
            const ny = dy / distance; // Normalized y direction

            const newX = super.getX() + nx * speed;
            const newY = super.getY() + ny * speed;
            super.setX(newX);
            super.setY(newY);
        }

    }

    attackUnit(targetUnit){
        if(!(targetUnit instanceof Unit)){
            throw new TypeError("Target must be a unit!")
        }
        const damage = this.damageDealer.getAttackDamage();
        targetUnit.damagable.getDamaged(damage);
        if(targetUnit.damagable.getHealth() <= 0){
            this.damageDealer.setTargetId(null);
        }
    }

    getPosition(){
        return {
            x: super.getX(),
            y: super.getY(),
        }
    }
    getHealth(){
        return this.damagable.getHealth();
    }
}
