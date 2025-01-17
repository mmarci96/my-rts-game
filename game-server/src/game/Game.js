const GameLogic = require("./logic/GameLogic")

module.exports = class Game {
    #gameId
    #gameLogic
    constructor(gameId, deleteUnit){
        this.#gameId = gameId;
        this.#gameLogic = new GameLogic(deleteUnit);
        this.running = false;
    }

    getId(){
        return this.#gameId;
    }

    loadGame(map, units){
        this.#gameLogic.loadMap(map)
        this.#gameLogic.loadUnits(units)
    }

    getGameState(){
        return {
            units: this.#gameLogic.getUnits(),
            map: []
        }
    }

    handlePlayerCommand(command){
        this.#gameLogic.handleCommand(command);
    }

    startGameLoop() {
        let uptime = 0
        this.running = true;
        console.log("Starting game loop...")
        let lastTime = Date.now();
        const interval = 50;

        this.gameLoopInterval = setInterval(() => {
            const now = Date.now()
            const deltaTime = (now - lastTime) / 1000
            lastTime = now;
            uptime += deltaTime;
            //console.log('uptime: ', uptime)

            this.#gameLogic.updateUnits(deltaTime);
        }, interval);
    }

    stopGameLoop() {
        if (this.gameLoopInterval) {
            this.running = false;
            clearInterval(this.gameLoopInterval);
            console.log("Game loop stopped.");
        }
    }

    isRunning(){
        return this.running;
    }
    connectPlayer(playerId, color){
        this.#gameLogic.addPlayer(playerId, color)
    }
    getConnectedPlayers(){
        return this.#gameLogic.getPlayers()
    }
    disconnectPlayer(playerId){
        this.#gameLogic.removePlayerById(playerId)
    }
}
