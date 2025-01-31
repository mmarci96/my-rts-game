const BuildingModel = require("../db/building.model")
const ResourceModel = require("../db/resource.model")
const Session = require("../db/session.model")
const Unit = require("../db/unit.model")
const BadRequestError = require('../error/BadRequestError')


class SessionService {
    static async createSession({data}){
        if(!data.units){
            throw new BadRequestError("Missing data to create", 402)
        }
        const session = new Session({
            units: [...data.units]
        })
        const saved = await session.save()

        if(!saved){
            throw new BadRequestError("Failed to create session", 400)
        }
        return saved
    }

    static async getUnitsBySessionId(sessionId){
        if(!sessionId){
            throw new BadRequestError("No session id provided", 403)
        }
        const session = await Session.findById(sessionId)
        const unitIds = session["units"]
        const units = await Unit.find({
            "_id": { $in: [
                ...unitIds
            ]}
        })

        if(!session){
            throw new BadRequestError(`No session with id: ${sessionId}`, 404)
        }

        return units;
    }

    static async getResourcesFromSessionId(sessionId) {
        if(!sessionId){
            throw new BadRequestError("No session id", 403)
        }

        const session = await Session.findById(sessionId)
        if(!session) {
            throw new BadRequestError(`No session with id: ${sessionId}`, 404)
        }

        const resourceFieldIds = session["resources"]
        const resources = await ResourceModel.find({
            "_id": { $in: [
                ...resourceFieldIds
            ]}
        })

        return resources;
    }

    static async getBuildingsFromSessionId(sessionId){
        if(!sessionId){
            throw new BadRequestError("No session id", 403)
        }

        const session = await Session.findById(sessionId)
        if(!session){
            throw new BadRequestError("No session found by id", 404)
        }

        const buildingIds = session["buildings"]
        const buildings = await BuildingModel.find({
            "_id": { $in: [
                ...buildingIds
            ]}
        })

        return buildings
    }

    static async deleteUnitById(unitId){
        const unit = await Unit.findByIdAndDelete(unitId);
        return unit;
    }

    static async saveUnitsData(units) {
        if (!Array.isArray(units) || units.length === 0) {
            throw new BadRequestError("No units data provided to save", 400);
        }

        const unitsToDelete = units.filter(unit => unit.health <= 0);

        const bulkOps = units
        .filter(unit => unit.health > 0) 
        .map(unit => {
            const { id, ...updateData } = unit;

            if (!id) {
                throw new BadRequestError("Unit is missing an id", 400);
            }

            return {
                updateOne: {
                    filter: { _id: id }, 
                    update: { 
                        $set: { 
                            ...updateData, 
                            updatedAt: Date.now() 
                        } 
                    },
                    upsert: true 
                }
            };
        });

        const result = await Unit.bulkWrite(bulkOps);

        let deleteResult = { deletedCount: 0 };
        if (unitsToDelete.length > 0) {
            const idsToDelete = unitsToDelete.map(unit => unit.id);

            if (idsToDelete.some(id => !id)) {
                throw new BadRequestError("Some units marked for deletion are missing an id", 400);
            }

            deleteResult = await Unit.deleteMany({ _id: { $in: idsToDelete } });
        }

        return {
            matched: result.matchedCount,
            modified: result.modifiedCount,
            upserted: result.upsertedCount,
            deleted: deleteResult.deletedCount 
        };
    }

}


module.exports = SessionService

