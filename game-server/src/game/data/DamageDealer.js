module.exports = class DamageDealer {
    #attackDamage;
    #targetId;
    constructor(attackDamage){
        this.#attackDamage = attackDamage;
        this.#targetId = null;
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
}
