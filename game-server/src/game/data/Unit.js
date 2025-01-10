const GameEntity = require('./GameEntity')
const Movable = require('./Movable')
const Damagable = require('./Damagable')

module.exports = class Unit extends GameEntity {
    constructor({ unitId, x, y, color, state, health, speed, type }){
        super({unitId, x, y, color, state, type})
        this.movable = new Movable(speed)
        this.damagable = new Damagable(health)
    }
    move(){
        const tx = this.movable.getTargetX()
        const ty = this.movable.getTargetY()
        const dx = tx - super.getX()
        const dy = ty - super.getY()
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = this.movable.getSpeed();
        if(distance <= speed){
            super.setX(tx);
            super.setY(ty);
            super.setState('idle');
        }
        const nx = dx / distance; // Normalized x direction
        const ny = dy / distance; // Normalized y direction
        super.setX(nx)
        super.setY(ny)
    }

    getPosition(){
        return {
            x: super.getX(),
            y: super.getY(),
        }
    }
}
