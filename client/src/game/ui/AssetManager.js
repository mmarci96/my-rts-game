class AssetManager {
    constructor() {
        this.images = new Map();
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
                console.log(img)
            };

            img.onerror = (err) => {
            console.error(`Failed to load image: ${src}`, err);
            reject(err);
            };
            img.src = src;
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
                this.loadImage('warrior_blue', 'http://localhost:5173/assets/Warrior/Blue/Warrior_Blue.png'),
                this.loadImage('warrior_purple', 'http://localhost:5173/assets/Warrior/Purple/Warrior_Purple.png'),
                this.loadImage('warrior_red', 'http://localhost:5173/assets/Warrior/Red/Warrior_Red.png'),
                this.loadImage('warrior_yellow', 'http://localhost:5173/assets/Warrior/Yellow/Warrior_Yellow.png'),

                // Pawns
                this.loadImage('pawn_blue', 'http://localhost:5173/assets/Pawn/Blue/Pawn_Blue.png'),
                this.loadImage('pawn_purple', 'http://localhost:5173/assets/Pawn/Purple/Pawn_Purple.png'),
                this.loadImage('pawn_red', 'http://localhost:5173/assets/Pawn/Red/Pawn_Red.png'),
                this.loadImage('pawn_yellow', 'http://localhost:5173/assets/Pawn/Yellow/Pawn_Yellow.png'),

                // Archers + Bow
                this.loadImage('archer_blue', 'http://localhost:5173/assets/Archer/Blue/Archer_Blue.png'),
                this.loadImage('archer_purple', 'http://localhost:5173/assets/Archer/Purple/Archer_Purlple.png'),
                this.loadImage('archer_red', 'http://localhost:5173/assets/Archer/Red/Archer_Red.png'),
                this.loadImage('archer_yellow', 'http://localhost:5173/assets/Archer/Yellow/Archer_Yellow.png'),
                this.loadImage('archer_bow_blue', 'http://localhost:5173/assets/Archer/Archer%20+%20Bow/Archer_Bow_Blue.png'),
                this.loadImage('archer_bow_purple', 'http://localhost:5173/assets/Archer/Archer%20+%20Bow/Archer_Bow_Purple.png'),
                this.loadImage('archer_bow_red', 'http://localhost:5173/assets/Archer/Archer%20+%20Bow/Archer_Bow_Red.png'),
                this.loadImage('archer_bow_yellow', 'http://localhost:5173/assets/Archer/Archer%20+%20Bow/Archer_Bow_Yellow.png'),

                // Arrow
                this.loadImage('arrow', 'http://localhost:5173/assets/Archer/Arrow/Arrow.png'),

                // Dead
                this.loadImage('dead', 'http://localhost:5173/assets/Dead/Dead.png'),

                // Tileset
                this.loadImage('directional_sign', 'http://localhost:5173/assets/TileSet/Tiles/directional_sign.png'),
                this.loadImage('dirt', 'http://localhost:5173/assets/TileSet/Tiles/dirt.png'),
                this.loadImage('fence', 'http://localhost:5173/assets/TileSet/Tiles/fence.png'),
                this.loadImage('fence10', 'http://localhost:5173/assets/TileSet/Tiles/fence10.png'),
                this.loadImage('fence11', 'http://localhost:5173/assets/TileSet/Tiles/fence11.png'),
                this.loadImage('fence2', 'http://localhost:5173/assets/TileSet/Tiles/fence2.png'),
                this.loadImage('fence3', 'http://localhost:5173/assets/TileSet/Tiles/fence3.png'),
                this.loadImage('fence4', 'http://localhost:5173/assets/TileSet/Tiles/fence4.png'),
                this.loadImage('fence5', 'http://localhost:5173/assets/TileSet/Tiles/fence5.png'),
                this.loadImage('fence6', 'http://localhost:5173/assets/TileSet/Tiles/fence6.png'),
                this.loadImage('fence7', 'http://localhost:5173/assets/TileSet/Tiles/fence7.png'),
                this.loadImage('fence8', 'http://localhost:5173/assets/TileSet/Tiles/fence8.png'),
                this.loadImage('fence9', 'http://localhost:5173/assets/TileSet/Tiles/fence9.png'),
                this.loadImage('grass1', 'http://localhost:5173/assets/TileSet/Tiles/grass1.png'),
                this.loadImage('lantern1', 'http://localhost:5173/assets/TileSet/Tiles/lantern1.png'),
                this.loadImage('lantern2', 'http://localhost:5173/assets/TileSet/Tiles/lantern2.png'),
                this.loadImage('lantern3', 'http://localhost:5173/assets/TileSet/Tiles/lantern3.png'),
                this.loadImage('lantern4', 'http://localhost:5173/assets/TileSet/Tiles/lantern4.png'),
                this.loadImage('pavement1', 'http://localhost:5173/assets/TileSet/Tiles/pavement1.png'),
                this.loadImage('pavement2', 'http://localhost:5173/assets/TileSet/Tiles/pavement2.png'),
                this.loadImage('scarecrow', 'http://localhost:5173/assets/TileSet/Tiles/scarecrow.png'),
                this.loadImage('stone', 'http://localhost:5173/assets/TileSet/Tiles/stone.png'),
                this.loadImage('stone2', 'http://localhost:5173/assets/TileSet/Tiles/stone2.png'),
                this.loadImage('stone_slab', 'http://localhost:5173/assets/TileSet/Tiles/stoneSlab.png'),
                this.loadImage('stone_stair', 'http://localhost:5173/assets/TileSet/Tiles/stoneStair.png'),
                this.loadImage('water1', 'http://localhost:5173/assets/TileSet/Tiles/waterV1.png'),
                this.loadImage('wheat', 'http://localhost:5173/assets/TileSet/Tiles/wheat.png'),
            ]);
            return this;
        } catch (err) {
            console.log(err);
            throw err; // Re-throw for additional error handling if needed
        }
    }
}

export default AssetManager;
