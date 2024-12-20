import GameMap from "./GameMap.js";
import Camera from "../ui/Camera.js";
import KeyEventHandler from "../ui/control/KeyEventHandler.js";
import SelectionBox from "../ui/control/SelectionBox.js";
import UnitController from "./UnitController.js";
import MouseEventHandler from "../ui/control/MouseEventHandler.js";
import { UnitCanvas } from "../data/UnitCanvas.js";

class GameLogic {
    #camera;
    #gameMap;
    #keyHandler;
    #mouseHandler;
    #pendingChanges;
    #mapData;
    #selectionBox;
    #assets;
    #commandHandler
    #unitCanvas;
    #units
    isInitialized = false;

    /**
    * @param { string [] } map 
    */ 
    constructor(map, assets, units) {
        this.#units = units;
        this.#mapData = map;
        this.#camera = new Camera(12, 12, 12, 12);
        this.#pendingChanges = new Set();
        this.#assets = assets;
        this.#gameMap = new GameMap(
            this.#mapData, this.#camera, this.#assets
        )        

        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#selectionBox = new SelectionBox();
        this.#mouseHandler = new MouseEventHandler(
                this.#camera, this.#selectionBox
        );
    }
    setupGame(){
        this.loadMap();
        this.drawUnits(this.#units)
    }

    loadMap() {
        this.#gameMap.drawMap()
        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#keyHandler.setupCameraControl(this.#gameMap);	
    }
    
    drawUnits(units) {
        console.log("From logic: ", units)
        units.forEach((unit) => {
            this.#unitCanvas.draw(unit)
        })
    }
	

	

}

export default GameLogic;
