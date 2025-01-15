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
    move(deltaTime){
        if(this.getState() !== 'moving') console.log('moving');
        const tx = this.movable.getTargetX()
        const ty = this.movable.getTargetY()
        const dx = tx - super.getX()
        const dy = ty - super.getY()
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = this.movable.getSpeed()/4;
        const stepDistance = speed*deltaTime;
        if(distance <= stepDistance){
            super.setX(tx);
            super.setY(ty);
            this.#updateState();
            this.movable.resetTarget();
        }else {
            const nx = dx / distance;
            const ny = dy / distance;
            const newX = super.getX() + nx * stepDistance;
            const newY = super.getY() + ny * stepDistance;
            super.setX(newX);
            super.setY(newY);
        }
    }

    #updateState(){
        if(this.damageDealer.getTargetId() !== null){
            this.setState('attack')
        } else {
            this.setState('idle');
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
