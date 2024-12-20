const Session = require("../db/session.model")
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

        if(!session){
            throw new BadRequestError(`No session with id: ${sessionId}`, 404)
        }

        return session.units
    }
}


module.exports = SessionService

