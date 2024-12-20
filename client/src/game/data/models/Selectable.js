class Selectable {
	#isSelected;
	#id
	#color

	constructor(id, color) {
		this.#id = id;
		this.#isSelected = false;
		this.#color = color;
	}

	select(selected) {
		this.#isSelected = selected;
	}

	isSelected() {
		return this.#isSelected;
	}

	getId() {
		return this.#id;
	}

	getColor() {
		return this.#color;
	}
}

export default Selectable;