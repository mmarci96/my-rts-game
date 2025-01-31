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

    getBuildingsByColor(color){
       return this.getBuildings().filter(building => building.getColor() === color);
    }
    getEnemyBuildings(color) {
        return this.getBuildings().filter(building => building.getColor() !== color)
    }

    refreshBuilding(){
        this.getBuildings().forEach(building => {
            if(!(building instanceof Building)){
                throw new TypeError('not build')
            }
            building.refresh();
        })
    }
}

export default BuildingController;
