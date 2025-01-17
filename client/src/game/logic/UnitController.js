import Unit from '../data/Unit.js';
import Warrior from '../data/Warrior.js';
import Worker from '../data/Worker.js';
import AssetManager from '../ui/AssetManager.js';
import Camera from '../ui/Camera.js';
import GameMap from './GameMap.js';

class UnitController {
    #assetManager;
    #units;
    #unitCanvas;

    /**
     * The actual picture loader asset map
     * @param { Promise<HTMLElement> } assets
     */
    constructor(assets) {
        if(!(assets instanceof AssetManager)) throw new TypeError('no pic')
        this.#assetManager = assets
        this.#unitCanvas = document.getElementById('game-canvas');
        this.#units = new Map();

        this.#unitCanvas.width = GameMap.WIDTH;
        this.#unitCanvas.height = GameMap.HEIGHT;
        this.#unitCanvas.zIndex = '3';
    }

    /**
    * Returns an object containing every field of the units. 
    * @returns { Array<Unit> }
    */
    getAllUnits() {
        if(!this.#units) console.error('unit list undefined')
        return [...this.#units.values()]
            .flatMap(unit => ({
                id: unit.getId(),
                x: unit.getX(),
                y: unit.getY(),
                color: unit.getColor(),
                state: unit.getState(),
                health: unit.getHealth(),
            }));
    }

    /**
    * Makes an array from the Map of units and filters them. 
    * @param { string } color  
    * @returns { Array<Unit>}
    */
    getUnitsByColor(color) {
        return[ ...this.#units.values()]
            .filter(unit => unit.getColor() === color);
    }

    /**
    * Makes an array from the Map of units and filters them. 
    * @param { string } color  
    * @returns { Array<Unit>}
    */
    getEnemyUnits(allyColor){
        return[...this.#units.values()]
            .filter(unit => unit.getColor() !== allyColor)
    }

    /**
    * Merges together logic to animate the sprites state and movement
    * @param { Camera } camera 
    */
    animationLoop(camera) {
        const canvas = this.#unitCanvas;
        const context = canvas.getContext('2d');
        let lastTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const deltaTime = (now - lastTime) / 1000
            lastTime = now;
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            [...this.#units.values()].forEach(unit => {
                if (!(unit instanceof Unit)) {
                    throw new Error('Unknown unit: ' + unit);
                }
                unit.draw(context, unit.getX(), unit.getY(), camera, deltaTime);
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    /**
    * They are still just js obj data with key / value pairs here
    * @param { Array<Unit>} data
    */
    refreshUnits(data) {
        if (!Array.isArray(data)) {
            throw new TypeError('Expected an array of unit data');
        }
        const existingUnitIds = new Set(this.#units.keys());

        data.forEach(unitData => {
            if (this.#units.has(unitData.id)) {
                this.updateUnit({...unitData })
            } else {
                this.loadUnit({...unitData});
            }
            // Mark this unit as processed
            existingUnitIds.delete(unitData["id"]);
        });
        [...existingUnitIds.keys()].forEach(unitId => {
            this.#units.delete(unitId);
        })
    }

    updateUnit({...props}){
        const {type, id, health, x, y, state, color, targetX, targetY, speed } = props;
        if (!type || !id || !x || !y || health === null) {
            throw new Error(`Missing:name${type};health: ${health};position:x:${x},y:${y} id=${id}`);
        }
        const unit = this.#units.get(id);
        if(!(unit instanceof Unit)) throw new TypeError('Not a unit')
        if (unit.getState() !== 'dead' &&
            state === 'dead' ){
            unit.onDeath(this.#assetManager.getImage('dead'))
        }  
        unit.setHealth(health);
        unit.setTarget(x,y);
        unit.setState(state)
    }

    /**
    * @param {Object} param0 
    */
    loadUnit({...props}) {
        const {type, id, health, x, y, state, color, targetX, targetY, speed } = props;
        if (!type || !id || !x || !y || health === null) {
            throw new Error(`Missing:name${type};health: ${health};position:x:${x},y:${y} id=${id}`);
        }
        let unit = null
        let spriteSheet = null;
        
        switch (type.toLowerCase()) {
            case 'warrior':
                spriteSheet = this.#assetManager.getImage(`warrior_${color}`);
                unit = new Warrior(x, y, spriteSheet, id, state, health, color, speed);
                break;
            case 'worker':
                spriteSheet = this.#assetManager.getImage(`pawn_${color}`);
                unit = new Worker(x, y, spriteSheet, id, state, health, color, speed);
                break;
            default:console.warn(`Unknown unit type: ${type}`);
        }

        if(!unit || !spriteSheet) return
        if (targetX) unit.setTarget(targetX, targetY);
        this.#units.set(id, unit);
    }
}

export default UnitController;
