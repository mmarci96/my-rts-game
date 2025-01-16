import SelectionBox from "./SelectionBox.js";
import Camera from "../Camera.js";
import VectorTransformer from "../../utils/VectorTransformer.js";
import Unit from "../../data/Unit.js";

class MouseEventHandler {
    #canvas;
    #camera;
    #selectionBox;
    #units
    #assets
    #enemyUnits

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
        this.#canvas.style.zIndex = '10';
        this.setCursor('default');
        this.hoveredEnemy = null;
        this.selectionActive = false;
    }

    /**
     *
     * @param { Array<Unit> } units
     * @param { function } mouseControl
     */
    drawSelection(units, mouseControl, enemyUnits) {
        this.#units = units;
        this.#enemyUnits = enemyUnits;
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
            // Handle selection drawing if currently selecting
            if (isSelecting) {
                this.onSelecting(e.clientX, e.clientY, startX, startY, ctx);
            }
            if(this.selectionActive){
                this.handleHover(e.clientX, e.clientY); 
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

            const selectedUnits = this.#selectionBox.handleSelecting(this.#units, this.#camera);
            if(selectedUnits.length > 0){
                this.selectionActive = true;
            } else {
                this.selectionActive = false;
            }
            console.log('units selected: ', selectedUnits);
        });
        this.#canvas.addEventListener('mousedown', e => {
            if (e.button === 2) {
                const target = this.getTargetPosition(this.#units, e.clientX, e.clientY);
                mouseControl(target)
            }
        });
    }
    onSelecting(clientX, clientY, startX, startY, ctx){
        const rect = this.#canvas.getBoundingClientRect();
        const screenX = clientX - rect.left;
        const screenY = clientY - rect.top;
        const currentX = screenX;
        const currentY = screenY;
        const width = currentX - startX;
        const height = currentY - startY;

        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX, startY, width, height);

    }
    handleHover(clientX, clientY){
        const hovering = this.#enemyUnits.find(eunit => {
            const { worldX, worldY } = this.convertCursorPosition(clientX, clientY);
            const diffX = Math.abs(worldX - eunit.getX());
            const diffY = Math.abs(worldY - eunit.getY());
            const max = 1.1
            if(diffX < max && diffY < max){
                return eunit;
            }
        })

        if(this.hoveredEnemy && !hovering){
            this.hoveredEnemy = null;
            this.setCursor('default');
        }
        if (hovering) {
            this.hoveredEnemy = hovering;
            this.setCursor('attack');
        } else {
            this.hoveredEnemy = null;
            this.setCursor('default');
        }
    }
    commandUnit(clientX, clientY){
        if(this.hoveredEnemy != null){
            const target = this.getTargetPosition(this.#units, clientX, clientY)
            mouseControl(target);
        }
    }
    createAttackCommand(targetUnit, unitId){
        const action = 'attack';
        return {
            unitId: unitId,
            action: action,
            targetX: targetUnit.getX(),
            targetY: targetUnit.getY(),
            targetId: targetUnit.getId()
        }
    }
    createMoveUnitCommand(targetX, targetY, unitId){
        const action = 'moving';
        return {
            unitId: unitId,
            action: action,
            targetX: targetX,
            targetY: targetY,
        }
    }

    /**
    * @param { Array<Unit> } units
    * @param { number } clientX
    * @param { number } clientY
    * @returns { {} }
    */
    getTargetPosition(units, clientX, clientY) {
        const { worldX, worldY } = this.convertCursorPosition(clientX, clientY) 
        const commands = []

        units.forEach((unit) => {
            if(unit.isSelected()){
                if(this.hoveredEnemy){
                    const targetEnemy = this.hoveredEnemy
                    const attackCommand = this.createAttackCommand(targetEnemy,unit.getId())
                    commands.push(attackCommand)
                } else {

                    const { targetX, targetY } = this.createCheapGrid(
                        unit.getX(),
                        unit.getY(),
                        worldX,
                        worldY,
                        gridSize,
                        index
                    );
                    const moveCommand = this.createMoveUnitCommand(targetX, targetY, unit.getId())
                    commands.push(moveCommand)
                }
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
        const targetX = worldX + col;
        const targetY = worldY + row;
        return { targetX, targetY };
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
    convertCursorPosition(clientX, clientY){
        const rect = this.#canvas.getBoundingClientRect();
        return VectorTransformer.getPositionFromCanvas({
            screenX: clientX - rect.left, 
            screenY: clientY - rect.top, 
            cameraX: this.#camera.getX(),
            cameraY: this.#camera.getY()
        });
    }
}

export default MouseEventHandler;
