import Camera from "../Camera.js";
import Unit from "../../data/Unit.js";
import {calculateScreenPos} from "../../utils/formulas.js";

class SelectionBox {
    #startX
    #startY
    #finalX
    #finalY

    constructor() {
        this.#startX = 0
        this.#startY = 0
        this.#finalY = 0
        this.#finalX = 0
    }

    /**
     * @param { number } startX
     * @param { number } startY
     * @param { number } endX
     * @param { number } endY
    */
    drawBox(startX, startY, endX, endY) {
        this.#startX = startX
        this.#startY = startY
        this.#finalX = endX
        this.#finalY = endY
    }

    /**
     * @param {Array<Unit>} units
     * @param { Camera } camera
     * @returns {Unit[]}
    */
    handleSelecting(units, camera) {
        if (!(camera instanceof Camera)) {
            throw new Error("Camera is not supported");
        }
        if (!(units instanceof Array)) {
            throw new Error("Units is not supported");
        }

        const selectionRect = {
            left: Math.min(this.#startX, this.#finalX) + 28,
            top: Math.min(this.#startY, this.#finalY) + 28,
            right: Math.max(this.#startX, this.#finalX) + 28,
            bottom: Math.max(this.#startY, this.#finalY) + 28,
        };

        return units.filter((unit) => {
            if (!(unit instanceof Unit)) {
                throw new TypeError("Unit is not supported");
            }

            const { px, py } = calculateScreenPos(camera, unit.x, unit.y);
            const unitRect = {
                left: px,
                top: py,
                right: px + 48,
                bottom: py + 48,
            };

            const isPartiallyInside = (
                selectionRect.right >= unitRect.left &&
                    selectionRect.left <= unitRect.right &&
                    selectionRect.bottom >= unitRect.top &&
                    selectionRect.top <= unitRect.bottom
            );

            unit.setSelected(isPartiallyInside);
        });
    }

}

export default SelectionBox;
