module.exports = class GameEntity {
    #x;
    #y;
    #unitId;
    #color;
    #state;

    constructor({ unitId, x, y, color, state }) {
        this.#unitId = unitId
        this.#x = x;
        this.#y = y;
        this.#color = color
        this.#state = state
    }

    getId(){
        return this.#unitId;
    }

    getColor(){
        return this.#color;
    }

    getState(){
        return this.#state;
    }

    setState(state){
        this.#state = state;
    }

    getX() {
        return this.#x;
    }

    setX(value) {
        if (typeof value === 'number') {
            this.#x = value;
        } else {
            throw new Error('x must be a number');
        }
    }

    getY() {
        return this.#y;
    }
    setY(value) {
        if (typeof value === 'number') {
            this.#y = value;
        } else {
            throw new Error('y must be a number');
        }
    }

    printPosition() {
        console.log(`Position: (${this.#x}, ${this.#y})`);
    }
}

