export class DrawUnit {
	constructor(spriteSheet) {
		this.spriteSheet = spriteSheet;
		this.frameWidth = 1152 / 6;
		this.frameHeight = 1536 / 8;
		this.frameX = 0;
		this.frameY = 0;
		this.gameFrame = 0;
		this.staggerFrames = 6; // requestAnimationFrame(60FPS)/ 6 = 10 FPS
	}
}