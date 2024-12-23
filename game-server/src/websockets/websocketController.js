const GameService = require('../service/game.service.js')
const MapService = require('../service/map.service.js')
const SessionService = require('../service/session.service.js')


const players = {}
const games = {}

const loadGameState = async gameId => {
    const gameData = await GameService.getGameById(gameId)
    const units = await SessionService.getUnitsBySessionId(gameData.sessionId)

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
            console.log("Saving units: ",units)
            const saved = await saveGameState(units)
            console.log("Saved units: ",saved)
        })
    })


    io.on('disconnect', socket => {
        console.log('Connection ended: ', socket.io)
        delete players[socket.id]
    })
}

const updateUnitPosition = (movingUnit) => {
    const x = movingUnit.x
    const y = movingUnit.y

    const dx = movingUnit.targetX - x;
    const dy = movingUnit.targetY - y;
    const distance = Math.sqrt(dx*dx + dy*dy)

    const minDistance = 0.1
    if(distance > minDistance) {
        const angle = Math.atan2(dy, dx);
        movingUnit.x += Math.cos(angle) * movingUnit.speed/64;
        movingUnit.y += Math.sin(angle) * movingUnit.speed/64;
        return movingUnit
    }
    movingUnit.state = 'idle';
    movingUnit.x = movingUnit.targetX;
    movingUnit.y = movingUnit.targetY;
    movingUnit.targetX = null;
    movingUnit.targetY = null;
}


module.exports = websocketController;
