import Camera from "../../ui/Camera";

class GameEntity {
    /**
    * @param {number} x
    * @param {number} y 
    */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
    * @param {number} y
    * @param {number} x
    * @param {Camera} camera
    * @param { CanvasRenderingContext2D } context 
    * @param { number } deltaTime
    */
    draw(context, camera, x, y, deltaTime) {
        throw new Error('Abstrct method, this need to be implemented!')
    }

    /**
    * @returns number
    */
    getX() {
        return this.x;
    }

    /**
    * @returns number
    */
    getY() {
        return this.y;
    }

    /**
    * @param { number} x
    */
    setX(x) {
        this.x = x;
    }

    /**
    * @param { number} y
    */
    setY(y) {
        this.y = y;
    }

    getClassName() {
        return this.constructor.name;
    }

    getAvailableActions() {
        return []
    }
}

export default GameEntity;
