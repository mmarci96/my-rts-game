class Attackable {
    #health
    #animationDone
    #dead

    /**
    * @param { number } health 
    * @constructor
    */
    constructor(health){
        this.#health = health;
        this.#dead = false;
        this.#animationDone = null;
    }

    /**
    * @returns { number }
    */
    getHealth(){
        return this.#health;
    }

    /**
    * @param {number} damage 
    */
    getAttacked(damage){
        this.#health -= damage;
    }

    isDead(){
        return this.#dead
    }

    startDeathAnimation(frames){
        this.#animationDone = frames;
    }

    refreshDeathAnimation(){
        this.#animationDone -= 1;
        if(this.#health <= 0 && this.#animationDone <= 0){
            this.#dead = true;
        }
    }
    setHealth(health){
        this.#health = health;
    }

}

export default Attackable;
