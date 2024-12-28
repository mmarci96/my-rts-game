const GameEntity = require(./GameEntity)

module.exports = class Unit extends GameEntity {
    constructor({ unitId, x, y}){
        super({unitId, x, y})
    }

    getPosition(){
        return {
            x: super.getX(),
            y: super.getY(),
        }
    }

}
