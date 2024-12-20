const mongoose = require('mongoose');
const { Schema } = mongoose;

const SessionSchema = new Schema({
    units: [ { type: mongoose.Schema.Types.ObjectId, required: true } ],
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Session", SessionSchema)
 
