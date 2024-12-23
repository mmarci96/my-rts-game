import SelectionBox from "./SelectionBox.js";
import Camera from "../Camera.js";
import {screenToWorld} from "../../utils/formulas.js"

class MouseEventHandler {
    #canvas;
    #camera;
    #selectionBox;
    #units
    #assets

    /**
     *
     * @param { Camera }camera
     * @param { SelectionBox } selectionBox
     */
    constructor(camera, selectionBox, assets) {
        if (!(selectionBox instanceof SelectionBox)) {
            throw new TypeError('SelectionBox requires selectionBox');
        }
        if (!(camera instanceof Camera)) {
            throw new TypeError('Camera requires camera');
        }
        this.#assets = assets;
        this.#camera = camera;
        this.#selectionBox = selectionBox;
        this.#canvas = document.getElementById('ui-canvas');
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;
        this.#canvas.style.zIndex = '4';
        this.setCursor('default');
        this.hoveredEnemies = [] 
    }

    /**
     *
     * @param { Array<Unit> } units
     * @param { function } mouseControl
     */
    drawSelection(units, mouseControl) {
        this.#units = units;
        const ctx = this.#canvas.getContext('2d');
        let isSelecting = false;
        let startX = 0;
        let startY = 0;

        this.#canvas.addEventListener('mousedown', e => {
            if (e.button === 2) return;
            const rect = this.#canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            isSelecting = true;
        });
        this.#canvas.addEventListener('mousemove', e => {
            if (isSelecting) {
                const rect = this.#canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;

                ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

                const width = currentX - startX;
                const height = currentY - startY;
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 1;
                ctx.strokeRect(startX, startY, width, height);
            }
        });
        this.#canvas.addEventListener('mouseup', e => {
            if (e.button === 2) return;
            const rect = this.#canvas.getBoundingClientRect();
            const finalX = e.clientX - rect.left;
            const finalY = e.clientY - rect.top;

            this.#selectionBox.drawBox(startX, startY, finalX, finalY);
            ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            isSelecting = false;

            this.#selectionBox.handleSelecting(this.#units, this.#camera);
        });
        this.#canvas.addEventListener('mousedown', e => {
            if (e.button === 2) {
                const target = this.getTargetPosition(this.#units, e.clientX, e.clientY);
                
                mouseControl(target)
            }
        });
    }

    getEnemyUnitOnHover(enemyUnits){
        this.#canvas.addEventListener('mousemove', e => {
            const rect = this.#canvas.getBoundingClientRect();
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;
            const { worldX, worldY } = screenToWorld(screenX, screenY, this.#camera);
            //console.log(worldY, worldX)

            const hovering = enemyUnits.filter(unit => {
                const x = unit.getX()
                const y = unit.getY()
                if(
                    worldX - 0.4 < x && worldX + 0.4 > x &&
                    worldY - 0.6 < y && worldY + 0.6 > y
                ){
                    return unit
                }
            })
            if(hovering.length >= 1 && this.#units.find(u=> u.isSelected())){
                this.hoveredEnemies.push(...hovering)
                this.setCursor('attack')
            } else{
                this.hoveredEnemies.filter((unit) => unit.getId() === null);
                setTimeout(() => {
                    this.setCursor('default')
                }, 100)
            }
            
        })

    }

    /**
     * @param { Array<Unit> } units
     * @param { number } clientX
     * @param { number } clientY
     * @returns { {} }
     */
    getTargetPosition(units, clientX, clientY) {
        const rect = this.#canvas.getBoundingClientRect();
        const screenX = clientX - rect.left;
        const screenY = clientY - rect.top;
        const { worldX, worldY } = screenToWorld(screenX, screenY, this.#camera);
        const commands = []

        const gridSize = Math.round(Math.sqrt(units.length));
        units.forEach((unit, index) => {
            const { row, col } = this.createCheapGrid(
                unit.getX(),
                unit.getY(),
                worldX,
                worldY,
                gridSize,
                index
            );
            const targetX = worldX + col;
            const targetY = worldY + row;
            if(unit.isSelected()){
                let action = 'moving'
                if(this.hoveredEnemies.length >= 1){
                    const enemId = this.hoveredEnemies[0].getId()
                    unit.attackUnit(enemId)
                }

                commands.push({
                    unitId: unit.getId(),
                    action: action,
                    targetX: targetX,
                    targetY: targetY,
                })
            }
        })

        return commands
    }


    /**
     *
     * @param {number} unitX
     * @param {number} unitY
     * @param {number} targetX
     * @param {number} targetY
     * @param {number} gridSize
     * @param {number} i
     * @returns {{row: number, col: number}}
     */
    createCheapGrid(unitX, unitY, targetX, targetY, gridSize, i) {
        let accX = 1.2;
        let accY = -1.2;
        if (unitX > targetX) accX = -1.2;
        if (unitY > targetY) accY = 1.2;

        const row = Math.floor(i / gridSize) * accX;
        const col = (i % gridSize) * accY;
        return { row, col };
    }

    setCursor(name){
        const defaultCursor = this.#assets.getImage(`${name}_cursor`);
        if (defaultCursor instanceof HTMLImageElement) {
            this.#canvas.style.cursor = `url(${defaultCursor.src}), auto`;
        } else if (typeof defaultCursor === 'string') {
            this.#canvas.style.cursor = `url(${defaultCursor}), auto`;
        } else {
            console.warn('Default cursor is not a valid image or URL.');
        }   

    }
}

export default MouseEventHandler;
