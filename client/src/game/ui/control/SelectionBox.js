import Camera from "../Camera.js";
import Unit from "../../data/Unit.js";
import VectorTransformer from "../../utils/VectorTransformer.js";
import Selectable from "../../data/models/Selectable.js";
import GameEntity from "../../data/models/GameEntity.js";

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
     * @param {Array<Unit>} selectablesList
     * @param { Camera } camera
     * @returns {Unit[]}
    */
    handleSelecting(selectablesList, camera) {
        if (!(camera instanceof Camera)) {
            throw new Error("Camera is not supported");
        }
        if (!(selectablesList instanceof Array)) {
            throw new Error("Units is not supported");
        }

        const selectionRect = {
            left: Math.min(this.#startX, this.#finalX) + 28,
            top: Math.min(this.#startY, this.#finalY) + 28,
            right: Math.max(this.#startX, this.#finalX) + 28,
            bottom: Math.max(this.#startY, this.#finalY) + 28,
        };

        return selectablesList.filter((selectable) => {
            if (!(selectable.selectable instanceof Selectable)) {
                throw new TypeError("Unit is not supported");
            }
            if(!(selectable instanceof GameEntity)){
                throw new TypeError("Unit is not entity");
            }

            const { px, py } = VectorTransformer.positionToCanvas({
                posX: selectable.getX(),
                posY: selectable.getY(),
                cameraX: camera.getX(),
                cameraY: camera.getY()
            });

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

            selectable.setSelected(isPartiallyInside);
            
            return selectable.isSelected()
        });
    }

}

export default SelectionBox;
