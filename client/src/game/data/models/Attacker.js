
class Attacker {
    #targetId
    #attackDmg

    /**
    * @param { number } attackDmg 
    */
    constructor(attackDmg){
        this.#attackDmg = attackDmg
    }

    setTargetId(targetId){
        this.#targetId = targetId;
    }

    getTargetId(){
        return this.#targetId;
    }
    getAttackDamage(){
        return this.#attackDmg
    }
    setAttackDmg(bonus){
        this.#attackDmg += bonus
    }
}

export default Attacker
