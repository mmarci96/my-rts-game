const GameEntity = require('./GameEntity')
const Movable = require('./Movable')
const Damagable = require('./Damagable')

module.exports = class Unit extends GameEntity {
    constructor({ unitId, x, y, color, state, health, speed}){
        super({unitId, x, y, color, state})
        this.movable = new Movable(speed)
        this.damagable = new Damagable(health)
    }

    getPosition(){
        return {
            x: super.getX(),
            y: super.getY(),
        }
    }
}
