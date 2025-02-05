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
        const actions = [
            {
                name: 'createWarrior',
                cost: 10,
                duration: 3,
                label: "Warrior"
            },
            {
                name: 'createWorker',
                cost: 5,
                duration: 3,
                label: "Worker"
            }
        ]
        return actions
    }
    updateActions() {

    }
}

export default House;
