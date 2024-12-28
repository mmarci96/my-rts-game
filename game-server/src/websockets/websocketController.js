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
        const game = new Game(gameId);
        const id = game.getId();
        console.log("Game created: ", id);
        game.loadGame(mapData.tiles, units)
        const state = game.getGameState()
        console.log('Gamestate after load: ',state)
    }

    games[gameId] = {
        units,
        gameData
    }
    return games[gameId]
}

const saveGameState = async unitsList => {
    const updatedUnits = await SessionService.saveUnitsData(unitsList)
    return updatedUnits;
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
            const gameData = await loadGameState(gameId)
            socket.join(gameId)
            io.to(gameId).emit('gameState', gameData)
        })

        socket.on('moveUnit', commands => {
            const gameId = players[socket.id].game
            commands.forEach(command => {
                const unitId = command.unitId;
                const u = games[gameId].units.find(unit => unit['_id'].toString() === unitId)
                u.targetX = command.targetX
                u.targetY = command.targetY
                u.state = 'moving'
            });
            io.to(gameId).emit('gameState', games[gameId])
        })

        socket.on('saveGame', async units => {
            // console.log("Saving units: ",units)
            const saved = await saveGameState(units)
            // console.log("Saved units: ",saved)
        })
    })


    io.on('disconnect', socket => {
        console.log('Connection ended: ', socket.io)
        delete players[socket.id]
    })
}


module.exports = websocketController;
