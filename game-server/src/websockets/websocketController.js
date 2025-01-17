const GameService = require('../service/game.service.js')
const MapService = require('../service/map.service.js')
const SessionService = require('../service/session.service.js')
const Game = require('../game/Game.js')

const players = {}
const games = {}
const deadUnits = []
let idk = 0
const deleteUnits = (unitId) => {
    if(unitId){
        SessionService.deleteUnitById(unitId)

    }
}

const loadGameState = async gameId => {
    idk++
    console.log('COUNT',idk)
    const gameData = await GameService.getGameById(gameId)
    const units = await SessionService.getUnitsBySessionId(gameData.sessionId)
    const mapData = await MapService.getMapById(gameData.mapId)
    console.log('Current games:\n',games, '\n')
    if(games[gameId] = 'undefined'){
        const game = new Game(gameId, deleteUnits);
        game.loadGame(mapData.tiles, units)
        games[gameId] = {
            gameData,
            game
        }
    } 
}

const saveGameState = unitsList => {
     SessionService.saveUnitsData(unitsList).then(data => console.log('saved:', data))
}

const getGameState = (gameId) => {
    const { game, gameData } = games[gameId]
    const gameState = {
        gameData,
        units: game.getGameState().units
    }
    return gameState
}

const websocketUpdater = (io, gameId) => {
    let count = 0
    const saveRate = 100
    setInterval(() => {
        const gameData = getGameState(gameId)
        io.to(gameId).emit('gameState', gameData)
        count++;
        if(count >= saveRate){
            console.log('data sent: ', gameData)
            saveGameState(gameData.units);
            count = 0;
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
            await loadGameState(gameId)

            const gameData = getGameState(gameId)
            socket.join(gameId)
            io.to(gameId).emit('gameState', gameData)
            if(!games[gameId].game.isRunning()){
                console.log('line before start loop')
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
        
    })


    io.on('disconnect', socket => {
        console.log('Connection ended: ', socket.io)
        delete players[socket.id]
        const gameId = players[socket.id].game
        //games[gameId].game.stopGameLoop();
    })
}


module.exports = websocketController;
