import GameMap from "./GameMap.js";
import Camera from "../ui/Camera.js";
import KeyEventHandler from "../ui/control/KeyEventHandler.js";
import SelectionBox from "../ui/control/SelectionBox.js";
import UnitController from "./UnitController.js";
import MouseEventHandler from "../ui/control/MouseEventHandler.js";
import Player from "../data/Player.js";

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
    #unitController;
    #units
    #player
    isInitialized = false;

    /**
    * @param { string [] } map 
    */ 
    constructor(map, assets, units, player) {
        if(!(player instanceof Player)){
            throw new TypeError('Invalid player')
        }
        this.#player
        this.#units = units
        this.#mapData = map;
        this.#camera = new Camera(12, 12, 12, 12);
        this.#pendingChanges = new Set();
        this.#assets = assets;
        this.#gameMap = new GameMap(
            this.#mapData, this.#camera, this.#assets
        )

        this.#unitController = new UnitController(this.#assets);

        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#selectionBox = new SelectionBox();
        this.#mouseHandler = new MouseEventHandler(
                this.#camera, this.#selectionBox
        );
    }
    setupGame(){
        this.loadMap();
        this.loadUnits();
    
    }

    loadMap() {
        this.#gameMap.drawMap()
        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#keyHandler.setupCameraControl(this.#gameMap);	
    }

    loadUnits(){
        this.#units.forEach(unit => {
           this.#unitController.loadUnit({...unit}) 
        });
        this.#unitController.animationLoop(this.#camera)
    }
    setupControl(){
        const playerColor = this.#player.getColor()
        const playerUnits = this.#unitController.getUnitsByColor(playerColor)

        this.#selectionBox.handleSelecting(playerUnits, this.#camera)
    }
    
	

	

}

export default GameLogic;
