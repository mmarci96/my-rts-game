const { default: mongoose } = require("mongoose");
const sessionModel = require("../db/session.model");
const unitModel = require("../db/unit.model")

module.exports = class UnitFactory {
    static async createWarrior({spawnX, spawnY, color, sessionId}){
        const warrior = await unitModel.create({
            "x": spawnX,
            "y": spawnY,
            "color": color,
            "state": "idle",
            "health": 16,
            "speed": 8,
            "type": "warrior"
        })
        await sessionModel.findOneAndUpdate(
            {_id: sessionId},
            { $push: {units: warrior["_id"] } }
        )
        return unit;
    }
    static async createWorker({spawnX, spawnY, color, sessionId}){
        const worker = await unitModel.create({
            "x": spawnX,
            "y": spawnY,
            "color": color,
            "state": "idle",
            "health": 10,
            "speed": 4,
            "type": "worker"
        })
        await sessionModel.findOneAndUpdate(
            {_id: sessionId},
            {$push: { units: worker["_id"] } }
        )
        return worker;
    }
}
