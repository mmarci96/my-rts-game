import AssetManager from "../game/ui/AssetManager";
import Player from "../game/data/Player";
import Game from "../game/Game";
import MapViewer from "./MapViewer";

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
            console.error(res)
            return res
        }
        return map;
    }
    static async fetchSessionData(sessionId){
        const res = await fetch('/api/games/sessions/' + sessionId)
        const session = await res.json()
        if(!res.ok){
            console.error(res)
            return res
        }
        return session
    }
    static async loadAssets(port){
        this.assetManager = new AssetManager(port);
        const assets = await this.assetManager.loadAssets()

        return assets
    }

    static async loadGame(userId, gameId, createCommand, port){
        const gameData = await this.fetchGameById(gameId)
        
        const { mapId, sessionId } = gameData

        const mapData = await this.fetchGameMap(mapId)
        console.log('Loading game with session id: ', sessionId)
        const assets = await this.loadAssets(port);

        const { color } = gameData.players.find(p => p.userId === userId)

        const player = new Player(userId, color)
        const game = new Game(mapData.tiles, assets, player, createCommand)
        game.setupPain();

        return game;
    }

    static async loadMapViewer(mapId, port){
        const mapData = await this.fetchGameMap(mapId);
        const assets = await this.loadAssets(port);
        
        const mapViewer = new MapViewer(mapData, assets)
        return mapViewer;
    }
}

export default GameLoader;
