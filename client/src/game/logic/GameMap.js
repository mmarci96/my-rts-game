import Camera from "../ui/Camera.js";
import VectorTransformer from '../utils/VectorTransformer.js'

class GameMap {
      static WIDTH = window.innerWidth;
      static HEIGHT = window.innerHeight;
      static TILE_HEIGHT = 24;
      static TILE_WIDTH = 48;
      #map;
      #camera;
      #assets;
     
      /**
       * Holds the map array and prints the map by making a map with a switch case basically
       * @param {[]} map - The map data.
       * @param {Camera} camera - The camera instance.
       * @param {AssetManager} assets - Preloaded assets.
       */
    constructor(map, camera, assets) {
        if (!(camera instanceof Camera)) {
          throw new TypeError('Not a valid camera!');
        }
        this.#map = map;
        this.#camera = camera;
        this.#assets = assets; // Store the AssetManager

        this.canvas = document.getElementById("map-canvas");
        this.canvas.style.zIndex = '0';
        this.canvas.width = GameMap.WIDTH;
        this.canvas.height = GameMap.HEIGHT;
      }

      /**
       * Renders the map onto a canvas.
       * @returns { void }
       */
    drawMap() {
        const camera = this.#camera;
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const offsetX = GameMap.WIDTH / 2;
        const offsetY = GameMap.HEIGHT / 2;

        const cameraX = camera.getX();
        const cameraY = camera.getY();

        const minY = cameraY - camera.getHeight()
        const maxY = cameraY + camera.getHeight()

        const minX = cameraX - camera.getWidth()
        const maxX = cameraX + camera.getWidth()

        for (let y = minY; y <= maxY; y++) {
              if (y < 0 || y >= this.#map.length) {
                continue;
              }
              const row = this.#map[y];

            for (let x = minX; x <= maxX; x++) {
                if (x < 0 || x >= row.length) {
                    continue;
                }
                const {px, py} = VectorTransformer.positionToCanvas({posX:x,posY:y,cameraX,cameraY});
                const name = row[x].tile; //this.#tileMapper(row[x])

                if (!name) continue

                const tilesetImage = this.#assets.getImage(name);
                const position = { z: row[x].z*128 }
                if(name !== 'water1'){
                    position.z = position.z*2
                }

                ctx.drawImage(tilesetImage, px, py - position.z);
            }
        }
    }

    getMapSize(){
        const mapHeight = this.#map.length;
        const mapWidth = this.#map[0].length;
        return { mapWidth, mapHeight };
    }

      /**
       * I added this then realized I have no emojis installed on my IDE xd
       * @param { string } char
       * @returns { string }
       */
    #tileMapper(char) {
        let name = 'empty'
        switch (char) {
          // Background (non-collidable) tiles (64 total)
          case '.':
            name = 'grass1'; // Grass
            break;
          case 'p':
            name = 'pavement1'; // Pine forest (non-collidable)
            break;
          case 'v':
            name = 'pavement2'; // Active volcano (collidable)
            break;
          case 'm':
            name = 'stone'; // Impassable mountain
            break;
          case 'c':
            name = 'stone2'; // Large cactus (collidable)
            break;
          case '#':
            name = 'water1'
            break;
          default:
            console.error("Unknown unit: " + char);
        }
        return name;
    }
}

export default GameMap;
