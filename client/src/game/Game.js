/** @format */

import GameLogic from './logic/GameLogic.js';

class Game {
	#gameLogic;

	/**
	 * An array of string will be the parameter we receive from endpoint/ws
	 * @param { Array<string> } map
	 */
	constructor(map) {
		if (!(map instanceof Array)) {
			throw new TypeError('Map loader requires at least one map');
		}
		this.#gameLogic = new GameLogic(map);
	}
	loadGame(units) {
		this.#gameLogic.loadStart(units)
	}

	startGame(units) {
		this.#gameLogic.start(units)
	}

	isRunning() {
		return this.#gameLogic.isInitialized;
	}

	draw(units) {
		this.#gameLogic.draw(units)
	}

}

export default Game;
