const GameSchema = require('../db/game.model');
const BadRequestError = require('../error/BadRequestError');

class GameService {
    static async createGame(data) {
        return await GameSchema.create(data);
    }

    static async getGameById(gameId) {
        const game = await GameSchema.findById(gameId);
        if (!game) {
          throw new BadRequestError('Game not found', 404);
        }
        return game;
    }

    static async deleteGame(gameId) {
        const game = await GameSchema.findByIdAndDelete(gameId);
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

        const game = await GameSchema.findByIdAndUpdate(
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

