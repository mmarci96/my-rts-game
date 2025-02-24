import Camera from "../../ui/Camera.js";
import Selectable from "./Selectable.js";
import VectorTransformer from "../../utils/VectorTransformer.js";

class AnimatedSprite {
    /**
    * @param { CanvasImageSource } spriteSheet
    */
    constructor(spriteSheet) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = 1152 / 6;
        this.frameHeight = 1536 / 8;
        this.frameX = 0;
        this.frameY = 0;
        this.gameFrame = 0;
        this.staggerFrames = 6; // requestAnimationFrame(60FPS)/ 6 = 10 FPS
        this.maxFrame = 5;
        this.skullFrames = 0;
        this.isAnimationComplete = false
    }

    updateAnimation() {
        if (this.isDying && this.maxFrame === 6) {
            if (this.skullFrames >= 7) {
                this.frameY = 1;
                this.isAnimationComplete = true; // Mark animation as complete
            } else {
                this.skullFrames++;
            }
        }
        if (this.gameFrame % this.staggerFrames === 0) {
            this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0;
        }
        this.gameFrame++;

    }

    /**
    * Drawing the image on every refresh from UnitController
    * @param { CanvasRenderingContext2D } context
    * @param { number } x
    * @param { number } y
    * @param { Camera }camera
    * @param { Selectable } selectable
    */
    draw(context, x, y, camera, selectable) {
        if(!(selectable instanceof Selectable)){
            throw new TypeError("not a legit selectable")
        }
        if (!(camera instanceof Camera)) {
            throw new TypeError('Camera undefined')
        }
        if (!this.spriteSheet) {
            console.error("Sprite sheet not loaded");
            return;
        }
        const isVisible = this.checkOutOfBounds(camera, x, y)

        if(isVisible) {
            const { px, py } = VectorTransformer.positionToCanvas({
                posX:x,
                posY:y, 
                cameraX: camera.getX(), 
                cameraY: camera.getY()
            })

            if(selectable.isSelected()){
                selectable.drawSelector(context, px, py)
            }

            context.drawImage(
                this.spriteSheet,
                this.frameX * this.frameWidth,
                this.frameY * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                px-64,
                py-64,
                128,
                128
            );
        }
    }

    /**
     * @param {CanvasImageSource} deathSprite 
     */
    setDeathAnimation(deathSprite){
        this.staggerFrames = 8
        this.skullFrames = 0; 
        this.maxFrame = 6
        this.frameWidth = 896 / 7
        this.frameHeight = 256 / 2;
        this.spriteSheet = deathSprite;
    }

    /**
     * @returns number 
     */
    getSkullFrames(){
        return this.skullFrames;
    }

    /**
    * Checks weather the  provided x, y coordinates are on the camera width
    * @param { Camera } camera
    * @param { number } x
    * @param { number } y
    * @returns {boolean}
    */
    checkOutOfBounds(camera, x, y) {
        const minX = camera.getX() - camera.getWidth() ;
        const maxX = camera.getX() + camera.getWidth() ;
        const minY = camera.getY() - camera.getHeight();
        const maxY = camera.getY() + camera.getHeight();

        return !(minY > y || minX > x || maxY < y || maxX < x);
    }

    /**
    * Each pic has 8 rows representing an animation for them
    * @param { string } state
    */
    setAnimationType(state) {
        switch (state) {
            case 'moving':
                this.frameY = 1
                break
            case 'idle':
                this.frameY = 0
                break
            case 'cooldown':
                this.frameY = 2;
                break;
            case 'attackLeft1':
                this.frameY = 2
                break
            case 'attackLeft2':
                this.frameY = 3
                break
            case 'attackDown1':
                this.frameY = 4
                break
            case 'attackDown2':
                this.frameY = 5
                break
            case 'attackUp1':
                this.frameY = 6
                break
            case 'attackUp2':
                this.frameY = 7
                break
            case 'dead':
                this.frameY = 0
                break;
            case 'delete':
                this.frameY = 1
                break;
            default:
                this.frameY = 0
                break;
        }
    }

}

export default AnimatedSprite;
