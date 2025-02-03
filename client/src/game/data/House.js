import Building from "./models/Building";

class House extends Building {
    constructor({ x, y, width, height, id, color, sprite, health }) {
        super({ x, y, width, height, id, color, sprite, health })
    }
    draw(ctx, camera) {
        super.draw(ctx, camera)
    }
    getId() {
        return super.getId()
    }
    getAvailableActions() {
        const actions = {}
        actions["makeUnit"] = {
            warrior: {
                cost: 10,
                duration: 3
            },
            worker: {
                cost: 5,
                duration: 3
            }
        }
        actions["upgrade"] = {
            warriorUpdate: {
                cost: 50,
                duraton: 20
            }
        }
        return actions
    }
    updateActions() {

    }
}

export default House;
