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
    static async saveUnitsData(units) {
        if (!Array.isArray(units) || units.length === 0) {
            throw new BadRequestError("No units data provided to save", 400);
        }

        // Separate units with 0 HP for deletion
        const unitsToDelete = units.filter(unit => unit.health <= 0);

        // Map remaining units for bulk operations
        const bulkOps = units
        .filter(unit => unit.health > 0) // Exclude units with 0 HP
        .map(unit => {
            const { id, ...updateData } = unit;

            // Ensure the `id` field exists in each unit object
            if (!id) {
                throw new BadRequestError("Unit is missing an id", 400);
            }

            return {
                updateOne: {
                    filter: { _id: id }, // Match the unit by its unique ID
                    update: { 
                        $set: { 
                            ...updateData, 
                            updatedAt: Date.now() // Update the timestamp
                        } 
                    },
                    upsert: true // Create a new unit if it doesn't already exist
                }
            };
        });

        // Execute the bulkWrite operation for updates
        const result = await Unit.bulkWrite(bulkOps);

        // Remove units with 0 HP
        let deleteResult = { deletedCount: 0 };
        if (unitsToDelete.length > 0) {
            const idsToDelete = unitsToDelete.map(unit => unit.id);

            // Ensure `id` exists in the unitsToDelete list
            if (idsToDelete.some(id => !id)) {
                throw new BadRequestError("Some units marked for deletion are missing an id", 400);
            }

            deleteResult = await Unit.deleteMany({ _id: { $in: idsToDelete } });
        }

        // Return a summary of the operations
        return {
            matched: result.matchedCount,
            modified: result.modifiedCount,
            upserted: result.upsertedCount,
            deleted: deleteResult.deletedCount // Add deletion result to the response
        };
    }

}


module.exports = SessionService

