import AssetManager from "../game/ui/AssetManager";
import Player from "../game/data/Player";
import Game from "../game/Game";

class GameLoader {
    static async fetchGameById(gameId) {
        const res = await fetch('/api/games/' + gameId)
        const game = await res.json()
        if(!res.ok){
            console.error(res.error)
            return res;
        }
        return game;
    }

    static async fetchGameMap(mapId){
        const res = await fetch('/api/games/maps/' + mapId)
        const map = await res.json()
        if(!res.ok){
            console.log(res)
            return res
        }
        return map;
    }
    static async fetchSessionData(sessionId){
        const res = await fetch('/api/games/sessions/' + sessionId)
        const session = await res.json()
        if(!res.ok){
            console.log(res)
            return res
        }
        return session
    }
    static async loadAssets(){
        this.assetManager = new AssetManager();
        const assets = await this.assetManager.loadAssets()

        return assets
    }

    static async loadGame(userId, gameId, createCommand){
        const gameData = await this.fetchGameById(gameId)
        
        const { mapId, sessionId } = gameData

        const mapData = await this.fetchGameMap(mapId)
        const units = await this.fetchSessionData(sessionId)
        const assets = await this.loadAssets();

        const { color } = gameData.players.find(p => p.userId === userId)


        const player = new Player(userId, color)
        const game = new Game(mapData.tiles, assets, units, player, createCommand)
        game.setupPain();

        return game;
    }
}

export default GameLoader;
