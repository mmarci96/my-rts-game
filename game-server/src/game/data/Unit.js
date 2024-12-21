class Unit {
    #id;
    #name;
    #health;
    #x;
    #y;
    #state;
    #targetX;
    #targetY;
    #color;
    constructor(name, id, health, x, y, state, color) {
        if (typeof name !== 'string') {
            throw new TypeError("Expected 'name' to be a string");
        }
        if (typeof health !== 'number' || health < 0) {
            throw new TypeError("Expected 'health' to be a positive number");
        }
        if (typeof x !== 'number' || typeof y !== 'number') {
            throw new TypeError("Expected 'x' and 'y' to be numbers");
        }
        if (typeof state !== 'string') {
            throw new TypeError("Expected 'state' to be a string");
        }
        this.#id = id; 
        this.#name = name;
        this.#health = health;
        this.#x = x;
        this.#y = y;
        this.#state = state;
        this.#targetX = null;
        this.#targetY = null;
        this.#color = color;
    }
    // To Object Method
    toObject() {
        return {
            id: this.#id,
            name: this.#name,
            color: this.#color,
            state: this.#state,
            health: this.#health,
            position: { x: this.#x, y: this.#y },
            target: this.#targetX !== null && this.#targetY !== null
                ? { x: this.#targetX, y: this.#targetY } : null,
        };
    }
    // Other Methods
    getColor() {
        return this.#color;
    }
    getId() {
        return this.#id;
    }
    checkCollision(otherUnit) {
        const distance = Math.sqrt(
            Math.pow(this.getX() - otherUnit.getX(), 2) +
                Math.pow(this.getY() - otherUnit.getY(), 2)
        );
        const collisionThreshold = 2;
        return distance < collisionThreshold;
    }
    setTarget(x, y) {
        if (isNaN(x) || isNaN(y)) {
            throw new TypeError('Target coordinates must be numbers');
        }
        this.#targetX = x;
        this.#targetY = y;
        this.#state = 'moving';
    }
    getTarget() {
        return { x: this.#targetX, y: this.#targetY };
    }
    updatePosition(deltaTime) {
        if (this.#targetX === null || this.#targetY === null) return null;
        const dx = this.#targetX - this.#x;
        const dy = this.#targetY - this.#y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 0.4) {
            this.#x = this.#targetX + Math.random() * 0.3;
            this.#y = this.#targetY + Math.random() * 0.3;
            this.#state = 'idle';
            this.#targetX = null;
            this.#targetY = null;
            return null;
        }
        const directionX = dx / distance;
        const directionY = dy / distance;
        this.#x += directionX * 0.2 * deltaTime;
        this.#y += directionY * 0.2 * deltaTime;
    }
    adjustPosition(dx, dy) {
        this.#x += dx;
        this.#y += dy;
    }
    attack(target) {
        console.log(`${this.#name} attacks ${target.getName()}!`); // Use the getter for name
    }
    getName() {
        return this.#name;
    }
    getHealth() {
        return this.#health;
    }
    setHealth(health) {
        this.#health = health;
    }
    getState() {
        return this.#state;
    }
    setState(state) {
        this.#state = state;
    }
    getPosition() {
        return { x: this.#x, y: this.#y };
    }
    setPosition(x, y) {
        this.#x = x;
        this.#y = y;
    }
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
}
module.exports = Unit;
