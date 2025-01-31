import Building from "../data/models/Building";
import AssetManager from "../ui/AssetManager";

class BuildingController {
    #buildings;
    #assets
    constructor(assets){
        if(!(assets instanceof AssetManager)){
            throw new TypeError("not assets manager")
        }
        this.#buildings = new Map();
        this.#assets = assets;
    }

    getBuildings(){
        return [...this.#buildings.values()]
    }

    loadBuildings(buildingList){
        buildingList?.forEach(building => {
            if(!this.#buildings.has(building.id)){
                const created = new Building({
                    x: building.x,
                    y: building.y,
                    id: building.id,
                    width: 128,
                    height: 196,
                    color: building.color,
                    sprite: this.#assets.getImage(`house_${building.color}`)
                })
                this.#buildings.set(
                    created.getId(), created
                )
            }
            
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
