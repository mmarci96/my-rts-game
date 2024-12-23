const Game = require('../db/game.model');
const BadRequestError = require('../error/BadRequestError');

class GameService {
    static async createGame(data) {
        return await Game.create(data);
    }

    static async getGameById(gameId) {
        const game = await Game.findById(gameId);
        if (!game) {
          throw new BadRequestError('Game not found', 404);
        }
        return game;
    }

    static async deleteGame(gameId) {
        const game = await Game.findByIdAndDelete(gameId);
        if (!game) {
            throw new BadRequestError('Game not found', 404);
        }
        return game;
    }

    static async updateGameStatus(gameId, status) {
        const allowedStatuses = ['waiting', 'in-progress', 'completed'];
        if (!allowedStatuses.includes(status)) {
            throw new BadRequestError('Invalid status');
        }

        const game = await Game.findByIdAndUpdate(
              gameId,
              { status },
              { new: true, runValidators: true }
        );

        if (!game) {
            throw new BadRequestError('Game not found', 404);
        }

        return game;
    }
}

module.exports = GameService;

