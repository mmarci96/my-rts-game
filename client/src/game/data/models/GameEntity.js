class GameEntity {
    constructor(x, y) {
        this.x = x; // Position
        this.y = y;
    }

    draw(context, camera, x, y, deltaTime) {
        throw new Error('Abstrct method, this need to be implemented!')
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
