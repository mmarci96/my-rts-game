const mongoose = require('mongoose');
const { Schema } = mongoose;

const SessionSchema = new Schema({
    units: [ { type: Schema.Types.ObjectId, required: true } ],
    resources: [ { type: Schema.Types.ObjectId, required: true } ],
    buildings: [{type: Schema.Types.ObjectId, required: true } ],
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Session", SessionSchema)
 
