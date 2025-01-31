import Camera from "../../ui/Camera.js";
import GameEntity from "./GameEntity.js";
import Selectable from "./Selectable.js";
import VectorTransformer from "../../utils/VectorTransformer.js";

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
        const { px, py } = VectorTransformer.positionToCanvas({
            posX:super.getX(),
            posY: super.getY(),
            cameraX: camera.getX(),
            cameraY: camera.getY()
        })
        context.drawImage(this.#sprite, px, py )
        
    }
    getId(){
        return this.selectable.getId();
    }
}

export default Building;
