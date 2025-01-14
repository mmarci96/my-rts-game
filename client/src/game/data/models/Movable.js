class Movable {
    #speed
    #targetX
    #targetY
    #isMoving

    /**
    * Just divide by 60 to get back the 60 fps thingy?
    * I think it makes sense but maybe passing down the framerate could be worth
    * @param { number } speed
    */
    constructor(speed) {
        this.#speed = speed / 200;
        this.#isMoving = false;
    }

    /**
    * Pretty easy to figure out. Although lot of logic ha been built around target
    * being null but it should rather check states for that
    * @param x
    * @param y
    */
    setTarget(x, y) {
        this.#isMoving = true;

        this.#targetX = x;
        this.#targetY = y
    }

    /**
    * I'm just a chill guy, we love pythagoras and linear algebra middle school example.
    * I have zero clue about the angle sin / cos part but that is what Wikipedia is for
    * @param x
    * @param y
    * @returns {{x: (*|number), y: (*|number)}}
    **/ 
    move(x, y) {
        this.x = x;
        this.y = y;

        // Calculate the direction vector
        const dx = this.#targetX - this.x;
        const dy = this.#targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Check if the target is reached
        if (distance <= 0.4) {
            // Snap to target and stop moving
            this.x = this.#targetX;
            this.y = this.#targetY;
            this.#isMoving = false;
            this.#targetX = null;
            this.#targetY = null;
            return { x: this.x, y: this.y };
        }

        // Normalize the direction vector
        const nx = dx / distance; // Normalized x direction
        const ny = dy / distance; // Normalized y direction

        // Move along the direction vector by speed
        this.x += nx * this.#speed;
        this.y += ny * this.#speed;

        return { x: this.x, y: this.y };
    }

    isMoving() {
        return this.#isMoving;
    }

}

export default Movable;
