const mongoose = require('mongoose');
const { Schema } = mongoose;

const MapSchema = new Schema({
    tiles: [],
    type: String,
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Map', MapSchema) 
