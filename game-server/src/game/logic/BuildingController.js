const Building = require("../data/Building");

module.exports = class BuildingController {
    #buildings

    constructor(buildings){
        this.#buildings = new Map();

    }

    loadBuildings(buildings){
        buildings.forEach(building => {
            const createBuilding = new Building({
                buildingId: building["_id"],
                x: unit["x"],
                y: unit["y"],
                color: unit["color"],
                health: unit["health"],
                type: unit["type"]
            }) 
            this.#buildings.set(
                createBuilding.getId(), createBuilding
            )
        });
    }

    getBuildingById(buildingId){
        return this.#buildings.get(buildingId)
    }

    getBuildings(){
        return [...this.#buildings.values()]
            .flatMap(building => ({
                id: building.getId(),
                x: building.getX(),
                y: building.getY(),
                color: building.getColor(),
                state: building.getState(),
                health: building.damagable.getHealth(),
                type: building.getType()
            }))
    }

}
