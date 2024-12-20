import Camera from "../../ui/Camera.js";
import {calculateScreenPos} from "../../utils/formulas.js";

class AnimatedSprite {
	constructor(spriteSheet) {
		this.spriteSheet = spriteSheet;
		this.frameWidth = 1152 / 6;
		this.frameHeight = 1536 / 8;
		this.frameX = 0;
		this.frameY = 0;
		this.gameFrame = 0;
		this.staggerFrames = 6; // requestAnimationFrame(60FPS)/ 6 = 10 FPS
	}

	updateAnimation() {
		if (this.gameFrame % this.staggerFrames === 0) {
			if (this.frameX < 5) this.frameX++;
			else this.frameX = 0;
		}
		this.gameFrame++;
	}

	/**
	 * Draws a green circle around the unit for the selected ones only hopefully
	 * @param {CanvasRenderingContext2D } ctx
	 * @param { number } x
	 * @param { number } y
	 */
	drawSelector(ctx, x, y) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(
			x,
			y,
			128 / 4,
			0,
			Math.PI * 2 // Full circle
		);
		ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	/**
	 * Drawing the image on every refresh from UnitController
	 * @param { CanvasRenderingContext2D } context
	 * @param { number } x
	 * @param { number } y
	 * @param { Camera }camera
	 * @param { Boolean }isSelected
	 */
	draw(context, x, y, camera, isSelected) {
		if (!(camera instanceof Camera)) {
			throw new TypeError('Camera undefined')
		}
		if (!this.spriteSheet) {
			console.error("Sprite sheet not loaded");
			return;
		}
		const isVisible = this.checkOutOfBounds(camera, x, y)

		if(isVisible) {
			const { px, py } = calculateScreenPos(camera, x, y);
			if(isSelected) this.drawSelector(context, px, py);

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
	 * Checks weather the  provided x, y coordinates are on the camera width
	 * @param { Camera } camera
	 * @param { number } x
	 * @param { number } y
	 * @returns {boolean}
	 */
	checkOutOfBounds(camera, x, y) {
		const minX = camera.getX() - camera.getWidth() - 2;
		const maxX = camera.getX() + camera.getWidth() - 2;
		const minY = camera.getY() - camera.getHeight() - 2;
		const maxY = camera.getY() + camera.getHeight() - 2;

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
			default:
				this.frameY = 0
				break;
		}
	}

}

export default AnimatedSprite;