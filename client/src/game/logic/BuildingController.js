import Building from "../data/models/Building";

class BuildingController {
    #buildings;
    constructor(){
        this.#buildings = new Map();
    }

    getBuildings(){
        return [...this.#buildings.values()]
    }

    loadBuildings(buildingList){
        buildingList.forEach(building => {
            if(!(building instanceof Building)){
                throw new TypeError("not a building!")
            }
            this.#buildings.set(building.getId(), building)
        });
    }
}

export default BuildingController;
