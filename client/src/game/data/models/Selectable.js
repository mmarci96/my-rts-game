class Selectable {
    #isSelected;
    #id
    #color

    /**
     * @param { string } id
     * @param { string } color 
     */
    constructor(id, color) {
        this.#id = id;
        this.#isSelected = false;
        this.#color = color;
    }

    /**
     * Draws a green circle around the unit for the selected ones only hopefully
     * @param {CanvasRenderingContext2D } ctx
     * @param { number } x
     * @param { number } y
     */
    drawSelector(ctx, x, y) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
            x,
            y,
            128 / 4,
            0,
            Math.PI * 2 // Full circle
        );
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    /**
     * @param { boolean } selected 
     */
    select(selected) {
        this.#isSelected = selected;
    }

    /**
     * @returns { boolean }
     */
    isSelected() {
        return this.#isSelected;
    }

    /**
    * @returns { string }
    */
    getId() {
        return this.#id;
    }

    /**
    * @returns { string }
    */
    getColor() {
        return this.#color;
    }
}

export default Selectable;
