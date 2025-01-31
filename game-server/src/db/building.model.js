const mongoose = require("mongoose")
const { Schema } = mongoose

const BuildingSchema = new Schema({
    x: { type: Number, required : true },
    y: { type: Number, required : true },
    color: { type: String, enum: ["blue", "purple", "yellow", "red"], required: true },
    health: {type: Number, required: true},
    type: { type: String, enum: ["main", "barrack", "storage", "tower"], required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Building", BuildingSchema);

