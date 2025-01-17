const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlayerSchema = new Schema({
    username: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    color: { type: String, required: true },
    elo: { type: Number, default: 500 },
    isReady: { type: Boolean, required: true },
});

module.exports = mongoose.model("Player", PlayerSchema)
