import SelectionBox from "./SelectionBox.js";
import Camera from "../Camera.js";
import {screenToWorld} from "../../utils/formulas.js"

class MouseEventHandler {
	#canvas;
	#camera;
	#selectionBox;
	#units;

	/**
	 *
	 * @param { Camera }camera
	 * @param { SelectionBox } selectionBox
	 */
	constructor(camera, selectionBox) {
		if (!(selectionBox instanceof SelectionBox)) {
			throw new TypeError('SelectionBox requires selectionBox');
		}
		if (!(camera instanceof Camera)) {
			throw new TypeError('Camera requires camera');
		}
		this.#camera = camera;
		this.#selectionBox = selectionBox;
		this.#canvas = document.getElementById('ui-canvas');
		this.#canvas.width = window.innerWidth;
		this.#canvas.height = window.innerHeight;
		this.#canvas.style.zIndex = '4';
	}
	/**
	 *
	 * @param { Array<Unit> } units
	 * @param { function } mouseControl
	 */
	drawSelection(units, mouseControl) {
		this.#units = units;
		const ctx = this.#canvas.getContext('2d');
		let isSelecting = false;
		let startX = 0;
		let startY = 0;

		this.#canvas.addEventListener('mousedown', e => {
			if (e.button === 2) return;
			const rect = this.#canvas.getBoundingClientRect();
			startX = e.clientX - rect.left;
			startY = e.clientY - rect.top;

			isSelecting = true;
		});
		this.#canvas.addEventListener('mousemove', e => {
			if (isSelecting) {
				const rect = this.#canvas.getBoundingClientRect();
				const currentX = e.clientX - rect.left;
				const currentY = e.clientY - rect.top;

				ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

				const width = currentX - startX;
				const height = currentY - startY;
				ctx.strokeStyle = 'green';
				ctx.lineWidth = 1;
				ctx.strokeRect(startX, startY, width, height);
			}
		});
		this.#canvas.addEventListener('mouseup', e => {
			if (e.button === 2) return;
			const rect = this.#canvas.getBoundingClientRect();
			const finalX = e.clientX - rect.left;
			const finalY = e.clientY - rect.top;

			this.#selectionBox.drawBox(startX, startY, finalX, finalY);
			ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
			isSelecting = false;

			this.#selectionBox.handleSelecting(units, this.#camera);
		});

		this.#canvas.addEventListener('mousedown', e => {
			if (e.button === 2) {
				this.setTargetPosition(units, e.clientX, e.clientY, mouseControl);
			}
		});
	}

	setTargetPosition(units, clientX, clientY, mouseControl) {
		const rect = this.#canvas.getBoundingClientRect();
		const screenX = clientX - rect.left;
		const screenY = clientY - rect.top;
		const { worldX, worldY } = screenToWorld(screenX, screenY, this.#camera);

		const gridSize = Math.round(Math.sqrt(units.length));
		units.forEach((unit, index) => {
			const { row, col } = this.createCheapGrid(
				unit.getX(),
				unit.getY(),
				worldX,
				worldY,
				gridSize,
				index
			);
			const targetX = worldX + col;
			const targetY = worldY + row;

			if (unit.isSelected()) {
				mouseControl(unit.getId(), targetX, targetY);

			}
		});

	}

	/**
	 *
	 * @param {number} unitX
	 * @param {number} unitY
	 * @param {number} targetX
	 * @param {number} targetY
	 * @param {number} gridSize
	 * @param {number} i
	 * @returns {{row: number, col: number}}
	 */
	createCheapGrid(unitX, unitY, targetX, targetY, gridSize, i) {
		let accX = 1.2;
		let accY = -1.2;
		if (unitX > targetX) accX = -1.2;
		if (unitY > targetY) accY = 1.2;

		const row = Math.floor(i / gridSize) * accX;
		const col = (i % gridSize) * accY;
		return { row, col };
	}
}

export default MouseEventHandler;