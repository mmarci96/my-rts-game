import GameMap from "./GameMap.js";
import Camera from "../ui/Camera.js";
import KeyEventHandler from "../ui/control/KeyEventHandler.js";
import SelectionBox from "../ui/control/SelectionBox.js";
import UnitController from "./UnitController.js";
import MouseEventHandler from "../ui/control/MouseEventHandler.js";
import Player from "../data/Player.js";
import BuildingController from "./BuildingController.js";
import DrawGameCanvas from "../ui/DrawGameCanvas.js";
import Overlay from "../ui/overlay/Overlay.js";

class GameLogic {
    static CAMERA_SIZE = Math.round(window.innerWidth / 32)
    #camera;
    #gameMap;
    #keyHandler;
    #mouseHandler;
    #mapData;
    #selectionBox;
    #assets;
    #commandHandler
    #unitController;
    #buildingController;
    #player
    isInitialized = false;
    #gameCanvas;
    #uiOverlay

    /**
    * @param { string [] } map 
    */
    constructor(map, assets, player, commandHandler) {
        if (!(player instanceof Player)) {
            throw new TypeError('Invalid player')
        }
        this.isRunning = false;
        this.#commandHandler = commandHandler
        this.#player = player
        this.#mapData = map;

        this.#camera = new Camera(16, 16, GameLogic.CAMERA_SIZE, GameLogic.CAMERA_SIZE);
        this.#assets = assets;
        this.#gameMap = new GameMap(this.#mapData, this.#camera, this.#assets)
        this.#uiOverlay = new Overlay(player);


        if (player.getColor() === 'blue') {
            const camOffSet = Math.sqrt(map.length * map.length)
            this.#camera.moveCamera(camOffSet / 2, camOffSet / 2)
        }

        this.#gameCanvas = new DrawGameCanvas(this.#camera)
        this.#gameCanvas.aimationLoop();
        this.#unitController = new UnitController(this.#assets);
        this.#buildingController = new BuildingController(this.#assets);

        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#selectionBox = new SelectionBox();
        this.#mouseHandler = new MouseEventHandler(
            this.#camera,
            this.#selectionBox,
            this.#assets,
            this.#buildingController,
            this.#uiOverlay
        );
    }

    setupGame() {
        this.loadMap();
        this.setupControl();
        this.isRunning = true;
    }

    stopGame() {
        this.isRunning = false
    }

    loadMap() {
        this.#gameMap.drawMap()
        this.#keyHandler = new KeyEventHandler(this.#camera);
        this.#keyHandler.setupCameraControl(this.#gameMap);
    }

    setupControl() {
        this.#mouseHandler.drawSelection(this.#commandHandler)
    }

    getUnitData() {
        return units = this.#unitController.getAllUnits()
    }

    updateUnits(units) {
        if (this.isRunning) {
            this.#unitController.refreshUnits(units)
            this.#mouseHandler.updateSelection(this.#unitController, this.#player.getColor())
            this.updateAnimations()
        }
    }

    updateBuildings(buildings) {
        if (this.isRunning) {
            this.#buildingController.loadBuildings(buildings)
        }
    }

    updateAnimations() {
        const units = this.#unitController.getUnits();
        const buildings = this.#buildingController.getBuildings();
        const entities = Array.of(...units, ...buildings)
        this.#gameCanvas.updateGameEntities(entities)
    }


}

export default GameLogic;
