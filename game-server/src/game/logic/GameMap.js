module.exports = class GameMap {
    #map
    constructor(map){
        this.#map = map
    }

    getTile(x,y){
        return map[y][x];
    }
}
