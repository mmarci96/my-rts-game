const GameEntity = require('./GameEntity')

module.exports = class Unit extends GameEntity {
    constructor({ unitId, x, y, color}){
        super({unitId, x, y, color})
    }

    getPosition(){
        return {
            x: super.getX(),
            y: super.getY(),
        }
    }
}
