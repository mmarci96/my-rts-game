module.exports = class Movable {
    #speed;
    #targetX;
    #targetY;

    constructor(speed){
        this.#speed = speed;
        this.#targetX = null;
        this.#targetY = null;
    }
    /**
    * Calculates the new position for a unit moving towards a target.
    * Using deltatime to make sure everything stays synced.
    * @param {number} startX - The current x-coordinate of the unit.
    * @param {number} startY - The current y-coordinate of the unit.
    * @param {number} deltaTime - The time difference between frames
    * @returns {{newX: number, newY: number}} - The new coordinates of the unit 
    */
    move({ startX, startY, deltaTime }) {
        const deltaX = this.getTargetX() - startX;
        const deltaY = this.getTargetY() - startY;
        const distanceToTarget = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        const speed = this.getSpeed() / 4;
        const stepDistance = speed * deltaTime;
        if (distanceToTarget <= stepDistance) {
            this.resetTarget();
            return { newX: startX, newY: startY, progress: 'completed' };
        }

        const directionX = deltaX / distanceToTarget;
        const directionY = deltaY / distanceToTarget;

        const newX = startX + directionX * stepDistance;
        const newY = startY + directionY * stepDistance;

        return { newX, newY, progress: 'progressing' };
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

    resetTarget(){
        this.#targetX = null;
        this.#targetY = null;
    }
}
