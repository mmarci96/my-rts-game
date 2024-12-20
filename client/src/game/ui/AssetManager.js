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
			};
			img.onerror = (err) => reject(err);
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
	loadAssets() {
		return Promise.all([
			this.loadImage('warrior_blue', './assets/Warrior/Blue/Warrior_Blue.png'),
			this.loadImage('worker_blue', './assets/Pawn/Blue/Pawn_Blue.png'),
			this.loadImage('warrior_red', './assets/Warrior/Red/Warrior_Red.png'),
			this.loadImage('worker_red','./assets/Pawn/Red/Pawn_Red.png'),
			this.loadImage('warrior_yellow', './assets/Warrior/Yellow/Warrior_Yellow.png'),
			this.loadImage('worker_yellow','./assets/Pawn/Yellow/Pawn_Yellow.png'),
			this.loadImage('grass1',    './assets/TileSet/Tiles/grass1.png'),
			this.loadImage('pavement1', './assets/TileSet/Tiles/pavement1.png'),
			this.loadImage('pavement2', './assets/TileSet/Tiles/pavement2.png'),
			this.loadImage('stone',     './assets/TileSet/Tiles/stone.png'),
			this.loadImage('stone2',    './assets/TileSet/Tiles/stone2.png'),
			this.loadImage('water1',    './assets/TileSet/Tiles/waterV1.png'),
			this.loadImage('empty',     './assets/TileSet/Tiles/dirt.png'),
		])
			.then(() => this)
			.catch(err => console.log(err));
	}

}

export default AssetManager;