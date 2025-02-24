const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
