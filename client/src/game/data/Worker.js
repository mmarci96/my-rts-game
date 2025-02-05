import Unit from "./Unit.js";

class Worker extends Unit {
    static MAX_HP = 10;
    constructor(x, y, spriteSheet, id, state, health, color, speed) {
        super(x, y, spriteSheet, id, state, health, color, speed)
    }

    getMaxHealth(){
        return Worker.MAX_HP
    }

}

export default Worker;
