const GameEntity = require("./GameEntity")
const Damagable = require("./Damagable")

module.exports = class Building extends GameEntity {
    
    constructor({ buildingId, x, y, color, health, type }){
        super({ buildingId, x, y, color, type, state: "idle"})
        this.damagable = new Damagable(health)
    }
    
    getPosition(){
        return {
            x: super.getX(),
            y: super.getY()
        }
    }

    getStatus(){
        return super.getState()
    }

    setState(state){
        return super.setState(state)
    }

    getHealth(){
        return this.damagalbe.getHealth()
    }
}
