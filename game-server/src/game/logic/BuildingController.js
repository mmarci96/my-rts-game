const Building = require("../data/Building");

module.exports = class BuildingController {
    #buildings

    constructor(buildings){
        this.#buildings = new Map();
        this.loadBuildings(buildings)

    }

    loadBuildings(buildings){
        buildings.forEach(building => {
            const createBuilding = new Building({
                buildingId: building["_id"].toString(),
                x: building["x"],
                y: building["y"],
                color: building["color"],
                health: building["health"],
                type: building["type"]
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
