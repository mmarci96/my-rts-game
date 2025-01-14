module.exports = class Damagable {
    #health
    constructor(health){
        this.#health = health
    }

    getDamaged(damage){
        this.#health -= damage; 
    }

    getHealth(){
        return this.#health;
    }
}
