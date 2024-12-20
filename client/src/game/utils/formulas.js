import GameMap from "../logic/GameMap.js";

const tileWidth = GameMap.TILE_WIDTH
const tileHeight = GameMap.TILE_HEIGHT
const offsetX = GameMap.WIDTH * 0.5
const offsetY = GameMap.HEIGHT * 0.5
/**
 * Transforms the tiles for us to isometric grin
 * @param { Camera } camera
 * @param { number } posX
 * @param { number } posY
 * @returns {{px: number, py: number}}
 */
export const calculateScreenPos = (camera, posX, posY) => {
	const cameraX = camera.getX() ;
	const cameraY = camera.getY() ;

	const px = ((posX - cameraX) - (posY - cameraY)) * (tileWidth * 0.5) + offsetX;
	const py = ((posX - cameraX) + (posY - cameraY)) * (tileHeight * 0.5) + offsetY;

	return {
		px,
		py,
	};
};

/**
 * Converts screen coordinates to world coordinates.
 * @param {number} screenX - The x coordinate on the screen (e.g., mouse x).
 * @param {number} screenY - The y coordinate on the screen (e.g., mouse y).
 * @param {Camera} camera - The camera object.
 * @returns {{ worldX: number, worldY: number }} The world coordinates.
 */
export const screenToWorld = (screenX, screenY, camera) => {
	const cameraX = camera.getX();
	const cameraY = camera.getY();

	const adjustedX = screenX - offsetX;
	const adjustedY = screenY - offsetY;

	const worldX = (adjustedX / (tileWidth / 2) + adjustedY / (tileHeight / 2)) / 2 + cameraX;
	const worldY = (adjustedY / (tileHeight / 2) - adjustedX / (tileWidth / 2)) / 2 + cameraY;

	return {worldX:worldX, worldY};
}


