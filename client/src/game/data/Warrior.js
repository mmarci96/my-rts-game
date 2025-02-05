import Unit from "./Unit.js";

class Warrior extends Unit {
    static MAX_HP = 16;
    constructor(x, y, spritesheet, id, state, health, color, speed) {
        super(x, y, spritesheet, id, state, health, color, speed);
    }

    getMaxHealth(){
        return Warrior.MAX_HP;
    }
}

export default Warrior;
