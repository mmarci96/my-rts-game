const GameLogic = require("./logic/GameLogic")

module.exports = class Game {
    #gameId
    #gameLogic
    constructor(gameId){
        this.#gameId = gameId;
        this.#gameLogic = new GameLogic();
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

    handleMoveCommand(command){
        this.#gameLogic.handleCommand(command);
    }

    startGameLoop() {
        console.log("Starting game loop...");

        const interval = 1000; // 1-second interval for the game loop
        this.gameLoopInterval = setInterval(() => {
            const gameState = this.getGameState();
            console.log("Game State:", gameState);

            // Optional: Logic to break the loop, such as checking a game over condition
            // Example:
            // if (this.#gameLogic.isGameOver()) {
            //     console.log("Game Over");
            //     clearInterval(this.gameLoopInterval);
            // }
        }, interval);
    }

    stopGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            console.log("Game loop stopped.");
        }
    }

}
