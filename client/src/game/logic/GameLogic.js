import GameMap from "./GameMap.js";
import Camera from "../ui/Camera.js";
import KeyEventHandler from "../ui/control/KeyEventHandler.js";
import SelectionBox from "../ui/control/SelectionBox.js";
import AssetManager from "../ui/AssetManager.js";
import UnitController from "./UnitController.js";
import MouseEventHandler from "../ui/control/MouseEventHandler.js";
import { UnitCanvas } from "../data/UnitCanvas.js";
import camera from "../ui/Camera.js";

class GameLogic {
	#camera;
	#gameMap;
	#unitController;
	#keyHandler;
	#mouseHandler;
	#pendingChanges;
	#mapData;
	#selectionBox;
	#assetManager;
	#commandHandler
	#unitCanvas;
	isInitialized = false;

	/**
	 * @param { string [] } map
	 */
	constructor(map, assetManager) {
        this.#mapData = map;
        this.#camera = new Camera(12, 12, 12, 12);
        this.#pendingChanges = new Set();
        this.#assetManager = assetManager;
        this.#unitCanvas = new UnitCanvas(this.#camera);

        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#selectionBox = new SelectionBox();
        this.#mouseHandler = new MouseEventHandler(
                this.#camera,
                this.#selectionBox
        );
    }
    loadStart(units) {
        console.log(units)
    }
	

    loadMap() {
        this.#gameMap = new GameMap(
			      this.#mapData,
			      this.#camera,
			      this.#assetManager
        );

        this.#gameMap.drawMap()

		    this.#keyHandler = new KeyEventHandler(this.#camera);
		    this.#keyHandler.setupCameraControl(this.#gameMap)

	}
    drawUnits(units) {
        console.log("From logic: ", units)
        units.forEach((unit) => {
            this.#unitCanvas.draw(unit)
        })
    }
	

	

}

export default GameLogic;
