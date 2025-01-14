import SelectionBox from "./SelectionBox.js";
import Camera from "../Camera.js";
import VectorTransformer from "../../utils/VectorTransformer.js";

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
        this.hoveredEnemies = [];
        this.selectionActive = false;
    }

    /**
     *
     * @param { Array<Unit> } units
     * @param { function } mouseControl
     */
    drawSelection(units, mouseControl, enemyUnits) {
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
            const rect = this.#canvas.getBoundingClientRect();
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;
            // Handle selection drawing if currently selecting
            if (isSelecting) {
                const currentX = screenX;
                const currentY = screenY;

                ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

                const width = currentX - startX;
                const height = currentY - startY;
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 1;
                ctx.strokeRect(startX, startY, width, height);
                return;
            }
            if(this.selectionActive){
                this.handleHover(screenX,screenY);
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
    handleHover(screenX,screenY){
        const cameraX = this.#camera.getX();
        const cameraY = this.#camera.getY();

        const { worldX, worldY } = VectorTransformer.getPositionFromCanvas({
            screenX, screenY, cameraX, cameraY
        })

        // Handle hover detection
        const hovering = enemyUnits.filter(unit => {
            const x = unit.getX();
            const y = unit.getY();
            return (
                worldX - 0.8 < x && worldX + 0.8 > x &&
                worldY - 1.0 < y && worldY + 1.0 > y
            );
        });

        if (hovering.length >= 1 && this.#units.find(u => u.isSelected())) {
            this.hoveredEnemies = hovering;
            this.setCursor('attack');
        } else {
            this.hoveredEnemies = [];
            this.setCursor('default');
        } 
    }
    commandUnit(clientX, clientY){
        if(this.hoveredEnemies.length > 0){
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
        const rect = this.#canvas.getBoundingClientRect();
        const screenX = clientX - rect.left;
        const screenY = clientY - rect.top;
        const { worldX, worldY } = VectorTransformer.getPositionFromCanvas({
            screenX, 
            screenY, 
            cameraX: this.#camera.getX(),
            cameraY: this.#camera.getY()
        }) 
        const commands = []

        units.forEach((unit) => {
            const targetX = worldX;
            const targetY = worldY;
            if(unit.isSelected()){
                if(this.hoveredEnemies.length >= 1){
                    const targetEnemy = this.hoveredEnemies[0]
                    const attackCommand = this.createAttackCommand(targetEnemy,unit.getId())
                    commands.push(attackCommand)
                } else {
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
