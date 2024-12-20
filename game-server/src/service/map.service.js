const Map = require('../db/map.model')
const BadRequestError = require('../error/BadRequestError')

class MapService {
    static async getMapById(mapId){
        if(!mapId){
            throw new BadRequestError('Missing mapId in request!', 400)
        }

        const map = await Map.findById(mapId)
        if(!map){
            throw new BadRequestError(`No map found with id: ${mapId}`, 404)
        }

        return map
    }

   static async getAllMaps() {
       const maps = await Map.find({}, { _id: 1, size: 1 }); 

       if (!maps || maps.length === 0) {
           throw new BadRequestError("No maps available", 404);
       }
       
       return maps;
   }
}

module.exports = MapService
