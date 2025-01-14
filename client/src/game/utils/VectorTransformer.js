import GameMap from "../logic/GameMap";

export default class VectorTransformer {
    static positionToCanvas({posX, posY, cameraX, cameraY}){
        const tileWidth = GameMap.TILE_WIDTH
        const tileHeight = GameMap.TILE_HEIGHT
        const offsetX = GameMap.WIDTH * 0.5
        const offsetY = GameMap.HEIGHT * 0.5
        const position = {
            px: ((posX - cameraX) - (posY - cameraY)) * (tileWidth / 2) + offsetX,
            py: ((posX - cameraX) + (posY - cameraY)) * (tileHeight / 2) + offsetY
        }
        return position;
    }
    static getPositionFromCanvas({screenX, screenY, cameraX, cameraY}) {
        const tileWidth = GameMap.TILE_WIDTH
        const tileHeight = GameMap.TILE_HEIGHT
        const offsetX = GameMap.WIDTH * 0.5
        const offsetY = GameMap.HEIGHT * 0.5

        const adjustedX = screenX - offsetX;
        const adjustedY = screenY - offsetY;

        const worldX = (adjustedX / (tileWidth / 2) + adjustedY / (tileHeight / 2)) / 2 + cameraX;
        const worldY = (adjustedY / (tileHeight / 2) - adjustedX / (tileWidth / 2)) / 2 + cameraY;

        return {worldX, worldY};
    }
}
