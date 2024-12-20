const mongoose = require('mongoose');
const { Schema } = mongoose;

const SessionSchema = new Schema({
    units: [],
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Session", SessionSchema)
 
