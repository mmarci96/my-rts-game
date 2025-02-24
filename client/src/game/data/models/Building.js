import Camera from "../../ui/Camera.js";
import GameEntity from "./GameEntity.js";
import Selectable from "./Selectable.js";
import VectorTransformer from "../../utils/VectorTransformer.js";
import Attackable from "./Attackable.js";

class Building extends GameEntity {
    #sprite
    /**
    * @param {number} x
    * @param {number} y
    * @param {string} id
    * @param {number} width
    * @param {string} color
    * @param {number} height
    * @param {CanvasImageSource} sprite 
    */
    constructor({ x, y, width, height, id, color, sprite, health }) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.selectable = new Selectable(id, color);
        this.attackable = new Attackable(health);
        this.#sprite = sprite
        this.activeActions = new Set()
        this.staggerRefesh = 60;
        this.refreshCount = 0
    }

    addAction(duration, actionName) {
        const timer = new Action(actionName, duration)
        this.activeActions.add(timer)
    }

    getActiveActions() {
        return [...this.activeActions.values()]
    }

    updateActions() {
        this.activeActions.forEach(activeAction => {
            if (activeAction.isReady()) {
                console.log("implement whats happenning here")
                this.activeActions.delete(activeAction)
            }
        })
    }

    /**
    * @param {number} y
    * @param {number} x
    * @param {CanvasRenderingContext2D} context
    * @param {Camera} camera
    * @param {number} deltaTime 
    */
    draw(context, camera, x, y, deltaTime) {
        this.refreshCount++
        if (this.refreshCount >= this.staggerRefesh) {
            this.refreshCount = 0;
            this.updateActions();
        }
        this.context = context
        this.camera = camera
        if (!(context instanceof CanvasRenderingContext2D)) {
            throw new TypeError('invalid canvas')
        }
        if (!(camera instanceof Camera)) {
            throw new TypeError('camera invalid')
        }
        const { px, py } = VectorTransformer.positionToCanvas({
            posX: super.getX(),
            posY: super.getY(),
            cameraX: camera.getX(),
            cameraY: camera.getY()
        })
        if (this.isSelected()) {
            context.save();
            context.beginPath();
            context.arc(
                px,
                py,
                80,
                0,
                Math.PI * 2 // Full circle
            );
            context.fillStyle = 'rgba(255, 255, 0, 0.3)';
            context.fill();
            context.closePath();
            context.restore();

        }
        context.drawImage(this.#sprite, px - this.width / 2, py - this.height / 2);

    }

    refresh() {
        this.draw(this.context, this.camera)
    }

    /**
    * @returns string
    */
    getId() {
        return this.selectable.getId();
    }

    /**
    * @param {boolean} selected 
    */
    setSelected(selected) {
        this.selectable.select(selected)
    }

    /**
    *@returns boolean
    */
    isSelected() {
        return this.selectable.isSelected();
    }

    /**
    *@returns string
    */
    getColor() {
        return this.selectable.getColor()
    }

    getHealth() {
        return this.attackable.getHealth()
    }
    getMaxHealth() {
        return 200;
    }
    getAvailableActions() {
        //return super.getAvailableActions()
    }

}

export default Building;
