const GameLogic = require("./logic/GameLogic")

module.exports = class Game {
    #gameId
    #gameLogic
    constructor(gameId, units, map){
        this.#gameId = gameId;
        this.#gameLogic = new GameLogic(units, map);
        this.running = false;
    }

    getId(){
        return this.#gameId;
    }

    loadGame(map, units){
        console.log("load the game", map, units)
        //this.#gameLogic.loadMap(map)
        //this.#gameLogic.loadUnits(units)
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
        console.log(this.#gameLogic.getPlayers())

        this.gameLoopInterval = setInterval(() => {
            if(this.#gameLogic.isGameOver()){
                console.log('wooooo', this.#gameLogic.isGameOver());
                this.winner = this.#gameLogic.isGameOver();
                this.stopGameLoop()
            }
            const now = Date.now()
            const deltaTime = (now - lastTime) / 1000
            lastTime = now;
            uptime += deltaTime;

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

    getWinner(){
        return this.winner;
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
        this.stopGameLoop();
    }
}
