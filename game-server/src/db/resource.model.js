const mongoose = require('mongoose')
const { Schema } = mongoose

const ResourceSchema = new Schema({
    x: { type: Number, required : true },
    y: { type: Number, required : true },
    availableResource: {type: Number, required: true},
    type: { type: String, enum: ["wheat", "wood", "rock", "metail"], required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("ResourceModel", ResourceSchema)
