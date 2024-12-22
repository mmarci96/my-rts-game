import GameMap from "../game/logic/GameMap";
import Camera from "../game/ui/Camera";
import KeyEventHandler from "../game/ui/control/KeyEventHandler";

class MapViewer {
    #mapData
    #assets
    #camera
    #gameMap
    #keyHandler

    /**
    * @param {Map<string,HTMLImageElement>} assets
    * @param { {} } mapData 
    */
    constructor(mapData, assets){
        this.#mapData = mapData;
        this.#assets = assets
        this.#camera = new Camera(20,20,20,20)
        this.#keyHandler = new KeyEventHandler(this.#camera);

        const map = this.#mapData.tiles
        this.#gameMap = new GameMap(map,this.#camera,this.#assets)
    }

    loadMap(){
        this.#gameMap.drawMap()
        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#keyHandler.setupCameraControl(this.#gameMap);	
    }
}

export default MapViewer;
