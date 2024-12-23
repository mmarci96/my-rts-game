const mongoose = require('mongoose');
const { Schema } = mongoose;

const UnitSchema = new Schema({
    x: { type: Number, required : true },
    y: { type: Number, required : true },
    color: { type: String, enum: ["blue", "purple", "yellow", "red"], required: true },
    health: {type: Number, required: true},
    speed: {type: Number, required: true},
    type: { type: String, enum: ["dead", "archer", "warrior", "worker"], required: true },
    state: { type: String , default: "idle"},
    targetX: { type: Number, default: null },
    targetY: { type: Number, default:  null },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Unit", UnitSchema)
 
