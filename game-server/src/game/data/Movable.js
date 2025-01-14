module.exports = class Movable {
    #speed
    #targetX
    #targetY

    constructor(speed){
        this.#speed = speed;
        this.#targetX = null;
        this.#targetY = null;
    }

    getTargetX(){
        return this.#targetX;
    }

    getTargetY(){
        return this.#targetY;
    }

    getTarget(){
        return {
            targetX: this.#targetX, 
            targetY: this.#targetY
        }
    }
    setTarget(tx, ty){
        this.#targetX = tx;
        this.#targetY = ty;
    }
    getSpeed(){
        return this.#speed;
    }
}
