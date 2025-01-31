const ResourceField = require("../data/ResourceField");

module.exports = class ResourceController {
    #resourceFields

    constructor(resources){
        this.#resourceFields = new Map()
        this.loadResources(resources)
    }

    loadResources(resources){
        resources.forEach(resource => {
            const resourceField = new ResourceField({
                resourceId: resource["_id"],
                x: resource["x"],
                y: resource["y"],
                type: resource["type"],
                availableResource: resource["availableResource"]
            })
            this.#resourceFields.set(
                resourceField.getId(), resourceField
            )
        });
    }

    getResources(){
        return [...this.#resourceFields.values()]
            .flatMap(resource => ({
                id: resource.getId(),
                x: resource.getX(),
                y: resource.getY(),
                type: resource.getType(),
                availableResources: resource.getAvailableResources()
            }))
    }
}
