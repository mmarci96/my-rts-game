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

    updateBuildings(){
        [...this.#buildings.values()].forEach(building => {
            if(!(building instanceof Building)){
                throw new TypeError("not building!")
            }
            if (building.getReadyActions().length >= 1){
                const actions = building.getReadyActions().map((action) => {
                    if(action?.name === 'createWarrior'){
                        
                    }
                })

            }
        })
    }

}
