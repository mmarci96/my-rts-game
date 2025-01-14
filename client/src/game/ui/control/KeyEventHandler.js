import Camera from "../Camera.js";
import GameMap from "../../logic/GameMap.js";


class KeyEventHandler {
    #camera
    /**
     * @param { Camera } camera
     */
    constructor(camera) {
        if (!(camera instanceof Camera)) {
            throw new TypeError("Camera must be defined")
        }
        this.#camera = camera;
    }

    /**
     * On the arrow and wasd keys added event listeners to move map around smoothly
     * @param { GameMap } gameMap
     */
    setupCameraControl(gameMap) {
        if (!(gameMap instanceof GameMap)) {
            throw new TypeError("GameMap must be defined")
        }
        const setupMovementListeners = (callbacks) => {
            // Destructure the callbacks for each key
            const {
                onUp = () => {
                },
                onDown = () => {
                },
                onLeft = () => {
                },
                onRight = () => {
                }
            } = callbacks;

            // Keydown event listener
            const handleKeydown = (event) => {
                switch (event.key) {
                    case 'w':
                    case 'ArrowUp':
                        onUp();
                        break;
                    case 's':
                    case 'ArrowDown':
                        onDown();
                        break;
                    case 'a':
                    case 'ArrowLeft':
                        onLeft();
                        break;
                    case 'd':
                    case 'ArrowRight':
                        onRight();
                        break;
                    default:
                        // Do nothing for other keys
                        break;
                }
            };

            document.addEventListener('keydown', handleKeydown);

            return () => {
                document.removeEventListener('keydown', handleKeydown);
            };
        };

        const enforceBounds = (cameraX, cameraY) => {
            const cameraWidth = this.#camera.getWidth();
            const cameraHeight = this.#camera.getHeight();

            const { mapWidth, mapHeight } = gameMap.getMapSize();

            const minX = cameraWidth;
            const maxX = mapWidth - cameraWidth;
            const minY = cameraHeight;
            const maxY = mapHeight - cameraHeight;

            const clampedX = Math.max(minX, Math.min(cameraX, maxX));
            const clampedY = Math.max(minY, Math.min(cameraY, maxY));

            this.#camera.setPosition(clampedX, clampedY);
        };

        const onDown = () => {
            this.#camera.moveCamera(1, 1);
            enforceBounds(this.#camera.getX(), this.#camera.getY());
            gameMap.drawMap();
        };
        const onRight = () => {
            this.#camera.moveCamera(1, -1);
            enforceBounds(this.#camera.getX(), this.#camera.getY());
            gameMap.drawMap();
        };
        const onLeft = () => {
            this.#camera.moveCamera(-1, 1);
            enforceBounds(this.#camera.getX(), this.#camera.getY());
            gameMap.drawMap();
        };
        const onUp = () => {
            this.#camera.moveCamera(-1, -1);
            enforceBounds(this.#camera.getX(), this.#camera.getY());
            gameMap.drawMap();
        };
        setupMovementListeners({onUp, onDown, onLeft, onRight});
    }
}

export default KeyEventHandler;
