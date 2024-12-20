import GameEntity from "./GameEntity.js";
import Selectable from "./Selectable.js";


class Building extends GameEntity {
	constructor(x, y, width, height) {
		super(x, y);
		this.width = width;
		this.height = height;
		Object.assign(this, new Selectable());
	}

	draw(context) {
		context.fillStyle = "grey";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

export default Building;