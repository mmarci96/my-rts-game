/** @format */

import GameMap from '../logic/GameMap.js';
import Warrior from './Warrior.js';
import Worker from "./Worker.js";

export class UnitCanvas {
	#units;
	#unitCanvas;
	#camera


    constructor(camera) {
		this.#camera = camera;
		this.#unitCanvas = document.getElementById('unit-canvas');
		this.#units = new Map();

		this.#unitCanvas.width = GameMap.WIDTH;
		this.#unitCanvas.height = GameMap.HEIGHT;
		this.#unitCanvas.zIndex = '3';
	}

	loadUnits(units, assets) {
		units.forEach(unit => {
			const { id, x, y, color, speed, state, health, type } = unit;

			const  spriteSheet = assets.getImage(`${type}_${color}`);
			switch (type.toLowerCase()) {
				case 'warrior':
					const warrior = new Warrior(x, y, spriteSheet, id, state, health, color);
					this.#units.set(warrior.getId(), warrior);
					break;
				case 'worker':
					const worker = new Worker(x, y, spriteSheet, id, state, health, color);
					this.#units.set(worker.getId(), worker);
					break;
				default: console.warn(`Unknown unit type: ${type}`);
			}
		});
	}
	draw(unitData) {
		const ctx = this.#unitCanvas.getContext('2d');
		const unit = this.#units.get(unitData.id)
		const camera = this.#camera
		unit.draw(ctx, unit.getX(), unit.getY(), camera);
	}

}
