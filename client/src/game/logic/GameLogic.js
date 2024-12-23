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
    #units
    #player
    isInitialized = false;

    /**
    * @param { string [] } map 
    */ 
    constructor(map, assets, units, player, commandHandler) {
        if(!(player instanceof Player)){
            throw new TypeError('Invalid player')
        }
        this.#commandHandler = commandHandler
        this.#player = player
        this.#units = units
        this.#mapData = map;
        this.#camera = new Camera(14, 14, 14, 14);

        if(player.getColor() === 'blue'){
            const camOffSet = Math.sqrt(map.length*map.length)
            this.#camera.moveCamera(camOffSet-28, camOffSet-28)
        }
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
        this.setupControl();
        this.drawHouse();
    
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
        
        this.#mouseHandler.drawSelection(playerUnits, this.#commandHandler )
    }
    getUnitData(){
        const units = this.#unitController.getAllUnits()
        return units
    }
    updateUnits(units){
        this.#unitController.refreshUnits(units)
        this.setupControl();
    }
    drawHouse(){
        const house = new House(5,5,128,127,'idhouse', 'red', this.#assets.getImage('dead'))
        console.log(house)
        const buildingCanvas = document.createElement('canvas')
        document.getElementById('root').appendChild(buildingCanvas)
        buildingCanvas.height = window.innerHeight
        buildingCanvas.width = window.innerWidth
        const ctx = buildingCanvas.getContext('2d')
        house.draw(ctx, this.#camera)
    }

}

export default GameLogic;
