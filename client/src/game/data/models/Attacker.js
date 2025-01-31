
class Attacker {
    #targetId
    #attackDmg

    /**
    * @param { number } attackDmg 
    */
    constructor(attackDmg){
        this.#attackDmg = attackDmg
    }

    /**
    * @param {string} targetId 
    */
    setTargetId(targetId){
        this.#targetId = targetId;
    }

    /**
    * @returns string
    */
    getTargetId(){
        return this.#targetId;
    }

    /**
    * @returns number
    */
    getAttackDamage(){
        return this.#attackDmg
    }

    /**
    * @param {number} bonus 
    */
    setAttackDmg(bonus){
        this.#attackDmg += bonus
    }
}

export default Attacker
