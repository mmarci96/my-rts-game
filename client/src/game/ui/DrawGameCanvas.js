import GameEntity from "../data/models/GameEntity";
import GameMap from "../logic/GameMap";
import Unit from "../data/Unit";

class DrawGameCanvas {
    #gameEntities
    #deadUnits
    #camera
    gameCanvas

    constructor(camera){
        this.#camera = camera;
        this.#gameEntities = new Set();
        this.gameCanvas = document.getElementById('game-canvas');
        this.#deadUnits = new Set(); 

        this.gameCanvas.width = GameMap.WIDTH;
        this.gameCanvas.height = GameMap.HEIGHT;
        this.gameCanvas.zIndex = '3';

    }

    addGameEntity(gameEntity){
        if(!gameEntity){
            return
        }
        if(!(gameEntity instanceof GameEntity)){
            throw new TypeError("not entity")
        }
        if(!this.#gameEntities.has(gameEntity)){
            this.#gameEntities.add(gameEntity)
        }
    }

    removeGameEntity(gameEntity){
        if(gameEntity){
            this.#gameEntities.delete(gameEntity)
        }
    }

    updateGameEntities(entityList){
        if(!(entityList instanceof Array)){
            throw new TypeError("must be array")
        }

        entityList.forEach(entity => {
            if(entity instanceof Unit && entity.getState() === 'dead' && entity.isAnimationComplete()){
                console.log(entity)
                this.removeGameEntity(entity)
                return; 
            }
            this.addGameEntity(entity)
        })
    }

    aimationLoop(){
        const canvas = this.gameCanvas;
        const camera = this.#camera
        const context = canvas.getContext('2d');
        let lastTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const deltaTime = (now - lastTime) / 1000
            lastTime = now;
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.#gameEntities.forEach(entity => {
                if(!(entity instanceof GameEntity)){
                    throw new TypeError("not valid entity")
                }
                entity.draw(context, camera, entity.getX(), entity.getY(), deltaTime);
            }) 
            requestAnimationFrame(animate);
        };
        animate();
    }

}

export default DrawGameCanvas
