import Camera from "../../ui/Camera.js";
import { calculateScreenPos } from "../../utils/formulas.js";
import GameEntity from "./GameEntity.js";
import Selectable from "./Selectable.js";


class Building extends GameEntity {
    #sprite
    constructor(x, y, width, height, id, color, sprite) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.selectable = new Selectable(id, color);
        this.#sprite = sprite
    }

    draw(context, camera) {
        if(!(context instanceof CanvasRenderingContext2D)){
            throw new TypeError('invalid canvas')
        }
        if(!(camera instanceof Camera)){
            throw new TypeError('camera invalid')
        }
        const { px, py } = calculateScreenPos(camera, super.getX(), super.getY())
        context.drawImage(this.#sprite, px, py )
        
    }
}

export default Building;
