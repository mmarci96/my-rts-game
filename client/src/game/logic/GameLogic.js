import GameMap from "./GameMap.js";
import Camera from "../ui/Camera.js";
import KeyEventHandler from "../ui/control/KeyEventHandler.js";
import SelectionBox from "../ui/control/SelectionBox.js";
import UnitController from "./UnitController.js";
import MouseEventHandler from "../ui/control/MouseEventHandler.js";
import Player from "../data/Player.js";
import House from "../data/House.js";

class GameLogic {
    #camera;
    #gameMap;
    #keyHandler;
    #mouseHandler;
    #mapData;
    #selectionBox;
    #assets;
    #commandHandler
    #unitController;
    #player
    isInitialized = false;

    /**
    * @param { string [] } map 
    */ 
    constructor(map, assets, player, commandHandler) {
        if(!(player instanceof Player)){
            throw new TypeError('Invalid player')
        }
        this.#commandHandler = commandHandler
        this.#player = player
        this.#mapData = map;
        this.#camera = new Camera(16, 16, 14, 14);
        this.isRunning = false;

        if(player.getColor() === 'blue'){
            const camOffSet = Math.sqrt(map.length*map.length)
            this.#camera.moveCamera(camOffSet/2, camOffSet/2)
        }
        this.#assets = assets;
        this.#gameMap = new GameMap(
            this.#mapData, this.#camera, this.#assets
        )

        this.#unitController = new UnitController(this.#assets);
        this.#unitController.animationLoop(this.#camera)
        
        this.#keyHandler = new KeyEventHandler(this.#camera);

        this.#selectionBox = new SelectionBox();
        
        this.#mouseHandler = new MouseEventHandler(
                this.#camera, this.#selectionBox, this.#assets
        );
    }
    setupGame(){
        this.loadMap();
        this.setupControl();
        this.isRunning = true;
    }

    stopGame(){
        this.isRunning = false
    }

    loadMap() {
        this.drawHouse();
        this.#gameMap.drawMap()
        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#keyHandler.setupCameraControl(this.#gameMap);	
    }

    setupControl(){
        this.#mouseHandler.drawSelection(this.#commandHandler)
    }

    getUnitData(){
        return units = this.#unitController.getAllUnits()

    }
    updateUnits(units){
        if(this.isRunning){
            this.#unitController.refreshUnits(units)
            this.#mouseHandler.updateSelection(this.#unitController, this.#player.getColor())
        }
    }

    drawHouse(){
        const houseRed = new House(5,5,128,128,'idhouse_red', 'red', this.#assets.getImage('house_red'))
        const houseBlue = new House(42,42,128,128,'idhouse_blue', 'blue', this.#assets.getImage('house_blue'))
        const gameCanvas = document.getElementById('map-canvas')
        const ctx = gameCanvas.getContext('2d')
        houseRed.draw(ctx, this.#camera)
        houseBlue.draw(ctx, this.#camera)
    }

}

export default GameLogic;
