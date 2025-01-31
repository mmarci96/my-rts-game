const express = require('express');
const router = express.Router();
const GameService = require('../service/game.service.js')
const MapService = require('../service/map.service.js')
const SessionService = require('../service/session.service.js')


router.get('/sessions/:sessionId', async(req, res, next) => {
    try {
        const { sessionId } = req.params
        const units = await SessionService.getUnitsBySessionId(sessionId)
        const buildings = await SessionService.getBuildingsFromSessionId(sessionId)
        const resources = await SessionService.getResourcesFromSessionId(sessionId)

        res.send({
            units, buildings, resources
        })
    } catch (error) {
       next(error) 
    }
})

// Create a new game
router.post('/', async (req, res, next) => {
  try {
    const game = await GameService.createGame(req.body);
    res.status(201).send(game);
  } catch (error) {
    next(error);
  }
});

// Get a game by ID
router.get('/:gameId', async (req, res, next) => {
  try {
    const game = await GameService.getGameById(req.params.gameId);
    res.send(game);
  } catch (error) {
    next(error);
  }
});

// Delete a game
router.delete('/:gameId', async (req, res, next) => {
    try {
        const game = await GameService.deleteGame(req.params.gameId);

        res.status(204).send({'message': 'game deleted', status: game });
    } catch (error) {
        next(error);
    }
});

// Update game status
router.patch('/:gameId/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const game = await GameService.updateGameStatus(req.params.gameId, status);
    res.send(game);
  } catch (error) {
    next(error);
  }
});

router.get('/maps/:mapId', async (req, res, next) => {
    try {
        const { mapId } = req.params
        const map = await MapService.getMapById(mapId)
        
        res.send(map)
    } catch (error) {
       next(error) 
    }
})

module.exports = router;

