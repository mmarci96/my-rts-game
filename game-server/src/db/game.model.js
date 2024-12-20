const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  mapSize: { type: String, enum: ['small', 'medium', 'large'], required: true },
  maxPlayers: { type: Number, required: true },
  players: { type: [{}], required: true },
  status: { type: String, enum: ['waiting', 'in-progress', 'completed'], default: 'waiting' },
  mapId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('Game', gameSchema);

