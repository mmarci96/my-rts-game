class GameEntity {
    constructor(x, y) {
        this.x = x; // Position
        this.y = y;
    }

    draw(context, x, y, camera) {

    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
}

export default GameEntity;
