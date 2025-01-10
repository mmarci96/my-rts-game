const GameService = require('../service/game.service.js')
const MapService = require('../service/map.service.js')
const SessionService = require('../service/session.service.js')
const Game = require('../game/Game.js')

const players = {}
const games = {}

const loadGameState = async gameId => {
    const gameData = await GameService.getGameById(gameId)
    const units = await SessionService.getUnitsBySessionId(gameData.sessionId)
    const mapData = await MapService.getMapById(gameData.mapId)
    if(games[gameId] = 'undefined'){
        console.log(gameData)
        const game = new Game(gameId);
        const id = game.getId();
        console.log("Game created: ", id);
        game.loadGame(mapData.tiles, units)
        const state = game.getGameState()
        console.log('Gamestate after load: ',state)
        games[gameId] = {
            gameData,
            game
        }
    } 
    return games[gameId]
}

const saveGameState = async unitsList => {
    console.log(unitsList)
    //const updatedUnits = await SessionService.saveUnitsData(unitsList)
    //return updatedUnits;
}

const getGameState = (gameId) => {
    const { game, gameData } = games[gameId]
    const gameState = {
        gameData,
        units: game.getGameState().units
    }
    return gameState
}

const websocketController = (io) => {
    io.on('connection', socket => {
        console.log('New websocket connection', socket.id)
        players[socket.id] = 'connected'

        socket.on('startGame', async data => {
            const { userId, gameId } = data
            players[socket.id] = {
                player: userId, 
                game: gameId
            }
            await loadGameState(gameId)

            const gameData = getGameState(gameId)
            socket.join(gameId)
            io.to(gameId).emit('gameState', gameData)
            if(!games[gameId].game.isRunning()){
                games[gameId].game.startGameLoop()
            }
            
        })

        socket.on('moveUnit', commands => {
            const gameId = players[socket.id].game
            commands.forEach(command => {
                games[gameId].game.handleMoveCommand(command)
            });
            //io.to(gameId).emit('gameState', games[gameId])
        })
        socket.on('updateGameState', () => {
            const gameId = players[socket.id].game
            const gameState = getGameState(gameId);
            console.log(gameState)
            io.to(socket.id).emit('gameState', gameState)
        })    
    })


    io.on('disconnect', socket => {
        console.log('Connection ended: ', socket.io)
        delete players[socket.id]
        const gameId = players[socket.id].game
        games[gameId].game.stopGameLoop();
    })
}


module.exports = websocketController;
