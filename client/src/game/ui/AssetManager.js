class AssetManager {
    constructor(port) {
        this.images = new Map();
        this.baseURL = port === '5173' ? 'http://localhost:5173' : 'http://localhost';
    }

    /**
    * Loads an image and stores it in the manager.
    * @param {string} key - Identifier for the image.
    * @param {string} src - Path to the image file.
    * @returns {Promise}
    */ 
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(key, img);
                resolve(img);
            };
            img.onerror = (err) => {
            console.error(`Failed to load image: ${src}`, err);
            reject(err);
            };
            img.src = `${this.baseURL}${src}`;
        });
    }

    /**
    * Retrieves a loaded image by its key.
    * @param {string} key
    * @returns {HTMLImageElement | undefined}
    */ 
    getImage(key) {
        return this.images.get(key);
    }

    /**
    * @returns { Promise<AssetManager> }
    */ 
    async loadAssets() {
        try {
            await Promise.all([
                // Warriors
                this.loadImage('warrior_blue', '/assets/Warrior/Blue/Warrior_Blue.png'),
                this.loadImage('warrior_purple', '/assets/Warrior/Purple/Warrior_Purple.png'),
                this.loadImage('warrior_red', '/assets/Warrior/Red/Warrior_Red.png'),
                this.loadImage('warrior_yellow', '/assets/Warrior/Yellow/Warrior_Yellow.png'),

                // Pawns
                this.loadImage('pawn_blue', '/assets/Pawn/Blue/Pawn_Blue.png'),
                this.loadImage('pawn_purple', '/assets/Pawn/Purple/Pawn_Purple.png'),
                this.loadImage('pawn_red', '/assets/Pawn/Red/Pawn_Red.png'),
                this.loadImage('pawn_yellow', '/assets/Pawn/Yellow/Pawn_Yellow.png'),

                // Archers + Bow
                this.loadImage('archer_blue', '/assets/Archer/Blue/Archer_Blue.png'),
                this.loadImage('archer_purple', '/assets/Archer/Purple/Archer_Purlple.png'),
                this.loadImage('archer_red', '/assets/Archer/Red/Archer_Red.png'),
                this.loadImage('archer_yellow', '/assets/Archer/Yellow/Archer_Yellow.png'),
                this.loadImage('archer_bow_blue', '/assets/Archer/Archer%20+%20Bow/Archer_Bow_Blue.png'),
                this.loadImage('archer_bow_purple', '/assets/Archer/Archer%20+%20Bow/Archer_Bow_Purple.png'),
                this.loadImage('archer_bow_red', '/assets/Archer/Archer%20+%20Bow/Archer_Bow_Red.png'),
                this.loadImage('archer_bow_yellow', '/assets/Archer/Archer%20+%20Bow/Archer_Bow_Yellow.png'),

                // Arrow
                this.loadImage('arrow', '/assets/Archer/Arrow/Arrow.png'),

                // Dead
                this.loadImage('dead', '/assets/Dead/Dead.png'),

                // Tileset
                this.loadImage('directional_sign', '/assets/TileSet/Tiles/directional_sign.png'),
                this.loadImage('dirt', '/assets/TileSet/Tiles/dirt.png'),
                this.loadImage('fence', '/assets/TileSet/Tiles/fence.png'),
                this.loadImage('fence10', '/assets/TileSet/Tiles/fence10.png'),
                this.loadImage('fence11', '/assets/TileSet/Tiles/fence11.png'),
                this.loadImage('fence2', '/assets/TileSet/Tiles/fence2.png'),
                this.loadImage('fence3', '/assets/TileSet/Tiles/fence3.png'),
                this.loadImage('fence4', '/assets/TileSet/Tiles/fence4.png'),
                this.loadImage('fence5', '/assets/TileSet/Tiles/fence5.png'),
                this.loadImage('fence6', '/assets/TileSet/Tiles/fence6.png'),
                this.loadImage('fence7', '/assets/TileSet/Tiles/fence7.png'),
                this.loadImage('fence8', '/assets/TileSet/Tiles/fence8.png'),
                this.loadImage('fence9', '/assets/TileSet/Tiles/fence9.png'),
                this.loadImage('grass1', '/assets/TileSet/Tiles/grass1.png'),
                this.loadImage('lantern1', '/assets/TileSet/Tiles/lantern1.png'),
                this.loadImage('lantern2', '/assets/TileSet/Tiles/lantern2.png'),
                this.loadImage('lantern3', '/assets/TileSet/Tiles/lantern3.png'),
                this.loadImage('lantern4', '/assets/TileSet/Tiles/lantern4.png'),
                this.loadImage('pavement1', '/assets/TileSet/Tiles/pavement1.png'),
                this.loadImage('pavement2', '/assets/TileSet/Tiles/pavement2.png'),
                this.loadImage('scarecrow', '/assets/TileSet/Tiles/scarecrow.png'),
                this.loadImage('stone', '/assets/TileSet/Tiles/stone.png'),
                this.loadImage('stone2', '/assets/TileSet/Tiles/stone2.png'),
                this.loadImage('stone_slab', '/assets/TileSet/Tiles/stoneSlab.png'),
                this.loadImage('stone_stair', '/assets/TileSet/Tiles/stoneStair.png'),
                this.loadImage('water1', '/assets/TileSet/Tiles/waterV1.png'),
                this.loadImage('wheat', '/assets/TileSet/Tiles/wheat.png'),
            ]);
            return this;
        } catch (err) {
            console.log(err);
            throw err; // Re-throw for additional error handling if needed
        }
    }
}

export default AssetManager;
