import Unit from "./Unit.js";

class Worker extends Unit {
	// No need for docs yet. the parent classes tell a story from unit and the name says
	// the rest
	constructor(x, y, spriteSheet, id, state, health, color, speed) {
		super(x, y, spriteSheet, id, state, health, color, speed)
	}


}

export default Worker;
