const GameService = require('../service/game.service.js')
const MapService = require('../service/map.service.js')
const SessionService = require('../service/session.service.js')
const Game = require('../game/Game.js')

const players = {}
const games = {}
const deleteUnits = (unitId) => {
    if(unitId){
        SessionService.deleteUnitById(unitId)

    }
}

const loadGameState = async gameId => {
    const gameData = await GameService.getGameById(gameId)
    const units = await SessionService.getUnitsBySessionId(gameData.sessionId)
    const mapData = await MapService.getMapById(gameData.mapId)
    console.log('Current games:\n',games, '\n')
    if(games[gameId] !== 'undefined'){
        const game = new Game(gameId,units, mapData);
        games[gameId] = {
            gameData,
            game
        }
    }
    return gameData
}

const saveGameState = unitsList => {
    SessionService.saveUnitsData(unitsList)
}

const getGameState = (gameId) => {
    const { game, gameData } = games[gameId]
    const gameState = {
        gameData,
        units: game.getGameState().units,
        winner: game.winner
    }
    return gameState
}

const websocketUpdater = (io, gameId) => {
    let count = 0
    const saveRate = 5 
    setInterval(() => {
        const gameData = getGameState(gameId)
        io.to(gameId).emit('gameState', gameData)
        count++;
        if(count >= saveRate){
            saveGameState(gameData.units);
            count = 0;
        }
        if(gameData.winner){
            io.to(gameId).emit('gameOver', gameData.winner)
            clearInterval();
        }
    }, 100);
}

const websocketController = (io) => {
    io.on('connection', socket => {
        console.log('New websocket connection', socket.id)

        socket.on('startGame', async data => {
            const { userId, gameId } = data
            players[socket.id] = {
                player: userId, 
                game: gameId
            }
            console.log("userid: ", userId)
            console.log('gameid: ', gameId)
            const startData = await loadGameState(gameId)

            const gameData = getGameState(gameId)
            socket.join(gameId)
            io.to(gameId).emit('gameState', gameData)
            const { color } = startData.players
            .find(p => p.userId.toString() === userId)

            games[gameId].game.connectPlayer(userId, color)           
            if(!games[gameId].game.isRunning()){
                games[gameId].game.startGameLoop()
                websocketUpdater(io,gameId);
            }
        })

        socket.on('pendingCommands', commands => {
            const gameId = players[socket.id].game
            console.log("GAME ID: ", gameId);
            commands.forEach(command => {
                games[gameId].game.handlePlayerCommand(command)
            });
        });
        socket.on('disconnect', () => {
            console.log('Connection ended: ', socket.id)

            const gameId = players[socket.id].game
            games[gameId].game.disconnectPlayer(players[socket.id].player);
            delete players[socket.id]
        })

    })


}


module.exports = websocketController;
