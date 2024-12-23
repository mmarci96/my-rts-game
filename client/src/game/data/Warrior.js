import Unit from "./Unit.js";

class Warrior extends Unit {
    constructor(x, y, spriteSheet, id, state, health, color, speed) {
        super(x, y, spriteSheet, id, state, health, color, speed);
        super.setBonusDmg(3)
    }
}

export default Warrior;
