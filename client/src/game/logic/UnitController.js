import Unit from '../data/Unit.js';
import Warrior from '../data/Warrior.js';
import Worker from '../data/Worker.js';
import GameMap from './GameMap.js';

class UnitController {
	#assetManager;
	#units;
	#unitCanvas;

	/**
	 * The actual picture loader asset map
	 * @param { Promise<HTMLElement> } assets
	 */
	constructor(assets) {
		this.#assetManager = assets;
		this.#unitCanvas = document.getElementById('unit-canvas');
		this.#units = new Map();

		this.#unitCanvas.width = GameMap.WIDTH;
		this.#unitCanvas.height = GameMap.HEIGHT;
		this.#unitCanvas.zIndex = '3';
	}

	getAllUnits() {
		return [...this.#units.values()];
	}

	getUnitsByColor(color) {
		return[ ...this.#units.values()]
			.filter(unit => unit.getColor() === color);
	}

	/**
	 * Merges together logic to animate the sprites state and movement
	 * @param camera
	 */
	animationLoop(camera) {
		const canvas = this.#unitCanvas;
		const context = canvas.getContext('2d');

		const updateTimer = 60 * 2;
		let frame = 0;

		const animate = () => {
			if (frame > updateTimer) {
				frame = 0;
			}
			frame++;

			context.clearRect(0, 0, canvas.width, canvas.height);
			[...this.#units.values()].forEach(unit => {
				if (!(unit instanceof Unit)) {
					throw new Error('Unknown unit: ' + unit);
				}

				unit.draw(context, unit.getX(), unit.getY(), camera);
			});
			requestAnimationFrame(animate);
		};
		animate();
	}

	/**
	 * They are still just js obj data with key / value pairs here
	 * @param { Array<unit>} data
	 */
	refreshUnits(data) {
		if (!Array.isArray(data)) {
			throw new TypeError('Expected an array of unit data');
		}

		const existingUnitIds = new Set(this.#units.keys());

		data.forEach(unitData => {
			console.log(unitData)
			//console.log(this.#units.get(unitData.id))
			// this.loadUnit({...unitData});
			//console.log(unitData);

			// Mark this unit as processed
			// existingUnitIds.delete(unitData.id);
		});

		// Remove units that are no longer in the data
		existingUnitIds.forEach(id => {
			this.#units.delete(id);
		});
	}

	loadUnit({...props}) {
		const {type, health, x, y, id, state, color, target} = props;
		if (!type || !id || !x || !y || !health) {
			throw new Error(`Missing data: name${type}, health: ${health}, position: x:${x},y:${y} id=${id}`);
		}
		if (this.#units.has(id)) {

			const unit = this.#units.get(id);
			unit.setState(state);
			if (target) {
				unit.setTarget(target.x, target.y);
			}
		} else {
			let unit = null
			let spriteSheet = null;

			switch (type.toLowerCase()) {
				case 'warrior':
					spriteSheet = this.#assetManager.getImage(`warrior_${color}`);
					unit = new Warrior(x, y, spriteSheet, id, state, health, color);
					break;
				case 'worker':
					spriteSheet = this.#assetManager.getImage(`worker_${color}`);
					unit = new Worker(x, y, spriteSheet, id, state, health, color);
					break;
				default:console.warn(`Unknown unit type: ${type}`);
			}

			if(!unit || !spriteSheet) return
			if (target) unit.setTarget(target.x, target.y);
			this.#units.set(id, unit);
		}
	}
}

export default UnitController;
