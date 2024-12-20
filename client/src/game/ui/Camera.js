class Camera {
	#x
	#y
	#width
	#height

	/**
	 * Add width to camera as how many rows and cols it should draw map and units on
	 * The camera location x, and y showing the middle of the camera location
	 * @param { number } x
	 * @param { number } y
	 * @param { number } width
	 * @param { number } height
	 */
	constructor(x, y,width, height) {
		this.#x = x
		this.#y = y
		this.#width = width
		this.#height = height
	}

	getX() {
		return this.#x
	}

	getY() {
		return this.#y
	}

	getHeight() {
		return this.#height
	}

	getWidth() {
		return this.#width
	}

	moveCamera(dx, dy) {
		this.#x += dx;
		this.#y += dy;
	}
	setPosition(x, y) {
		this.#x = x;
		this.#y = y;
	}
}

export default Camera;
