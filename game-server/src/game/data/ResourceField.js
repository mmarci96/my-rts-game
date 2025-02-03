module.exports = class ResourceField {
    #resourceId
    #x
    #y
    #type
    #availableResource

    constructor({ resourceId, x, y, type, availableResource }){
        this.#resourceId = resourceId
        this.#x = x
        this.#y = y
        this.#type = type
        this.#availableResource = availableResource
    }

    getId(){
        return this.#resourceId;
    }

    getPosition(){
        return {
            x: this.#x,
            y: this.#y
        }
    }

    getType(){
        return this.#type
    }

    getAvailableResources(){
        return this.#availableResource
    }

    setAvailableResource(availableResource){
        this.#availableResource = availableResource
    }

}
