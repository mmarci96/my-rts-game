const GameEntity = require('./GameEntity')
const Movable = require('./Movable')
const Damagable = require('./Damagable')
const DamageDealer = require('./DamageDealer')

module.exports = class Unit extends GameEntity {
    static #unitBaseAttack = 2;
    static #unitBaseAttackSpeed = 1;

    constructor({ unitId, x, y, color, state, health, speed, type, attackDmg }){
        super({unitId, x, y, color, state, type})
        this.movable = new Movable(speed)
        this.damagable = new Damagable(health)
        let dmg = attackDmg;
        if(!dmg) dmg = Unit.#unitBaseAttack;
        this.damageDealer = new DamageDealer(dmg, Unit.#unitBaseAttackSpeed)
        this.idleTime = 0;
        this.deleteTime = 0;
    }

    updatePosition(deltaTime){
        this.idleTime = 0;
        const { newX, newY, progress } = this.movable.move({
            startX: this.getX(), 
            startY: this.getY(), 
            deltaTime: deltaTime
        });
        
        if(progress !== 'completed'){
            this.setX(newX);
            this.setY(newY);
            this.setState('moving');
            return;
        }

        if(this.damageDealer.getTargetId() !== null){
            this.setState('attack');
            return;
        }

        this.setState('idle');
        return;
    }

    death(deltaTime){
        this.deleteTime += deltaTime;
        if(this.deleteTime > 1){
            this.setState('delete')
            return true;
        }
        return false;
    }

    attackUnit(targetUnit){
        if(!this.damageDealer.canAttack()){
            console.error('Unit should not attack on cooldown')
        }
        
        if(!(targetUnit instanceof Unit)){
            throw new TypeError("Target must be a unit!")
        }

        const damage = this.damageDealer.getAttackDamage();
        targetUnit.damagable.getDamaged(damage);
        if(targetUnit.damagable.getHealth() <= 0){
            this.damageDealer.setTargetId(null);
            this.setState('idle');
            return 'no-target'
        }

        this.damageDealer.startCoolDown();
        this.setState('cooldown');
    }

    updateAttackCooldown(deltaTime){
        if(!this.damageDealer.canAttack()){
            this.damageDealer.updateCooldown(deltaTime);
            return;
        }
        this.setState('attack');
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
