import AssetManager from "../game/ui/AssetManager";

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
}

export default GameLoader;
