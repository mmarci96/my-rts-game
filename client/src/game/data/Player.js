class Player {
	#playerId
	#color

	/**
	 * Socket io id auto generated, only lasts a game...
	 * @param { string } playerId
	 * @param { string } color
	 */
	constructor(playerId, color) {
		this.#playerId = playerId
		this.#color = color
	}

	/**
	 * The color marks the units to showcase who they belong to. Since we can make a
	 * quick lookup I do not want to store the units here
	 * @returns {*}
	 */
	getColor() {
		return this.#color
	}

	/**
	 * @returns { string }
	 */
	getId() {
		return this.#playerId
	}

}

export default Player