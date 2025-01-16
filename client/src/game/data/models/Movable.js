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
        this.#speed = 0.05;
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
        // Calculate the direction vector
        const dx = this.#targetX - x;
        const dy = this.#targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Check if the target is reached
        if (distance <= 0.1) {
            // Snap to target and stop moving
            this.#isMoving = false;
            return { x, y };
        }
        // Normalize the direction vector
        const nx = dx / distance; // Normalized x direction
        const ny = dy / distance; // Normalized y direction

        // Move along the direction vector by speed
        const tx = x + nx * this.#speed;
        const ty = y + ny * this.#speed;

        return { x: tx, y: ty };
    }

    isMoving() {
        return this.#isMoving;
    }

}

export default Movable;
