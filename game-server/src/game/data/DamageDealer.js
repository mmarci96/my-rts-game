module.exports = class DamageDealer {
    #attackDamage;
    #targetId;
    #attackSpeed;
    #coolDown;
    
    constructor(attackDamage, attackSpeed){
        this.#attackDamage = attackDamage;
        this.#attackSpeed = attackSpeed;
        this.#coolDown = 0;
        this.#targetId = null;
    }

    getAttackSpeed(){
        return this.#attackSpeed;
    }

    getAttackDamage(){
        return this.#attackDamage;
    }
    
    setTargetId(targetId){
        this.#targetId = targetId;
    }
    
    getTargetId(){
        return this.#targetId;
    }

    startCoolDown(){
        this.#coolDown = 1 / this.#attackSpeed;
    }

    updateCooldown(deltaTime){
        this.#coolDown -= deltaTime;
        if (this.#coolDown < 0) {
            this.#coolDown = 0;
        }
    }

    canAttack(){
        return this.#coolDown <= 0;
    }
}
