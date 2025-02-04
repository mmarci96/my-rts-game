module.exports = class GameEntity {
    #x;
    #y;
    #unitId;
    #color;
    #state;
    #type;

    constructor({ unitId, x, y, color, state, type }) {
        this.#unitId = unitId
        this.#x = x;
        this.#y = y;
        this.#color = color
        this.#state = state
        this.#type = type
    }

    getId(){
        return this.#unitId;
    }

    getType(){
        return this.#type;
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

    getActions(){
        console.error("abtract method");
    }

    printPosition() {
        console.log(`Position: (${this.#x}, ${this.#y})`);
    }
}

