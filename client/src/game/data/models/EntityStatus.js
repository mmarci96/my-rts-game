class EntityStatus {
    #state
    #timeStamp

    /**
    * Just saves the state of entities if they have something to share to outside
    * or busy walkin' like a boss might as well a dead body?
    * @param state
    * @param timeStamp
    */
    constructor(state, timeStamp) {
        this.#state = state || 'idle'
        this.#timeStamp = timeStamp || Date.now();
    }

    /** Sor far it should be 'idle', 'moving' and 'attack' maybe 'dead'?
    * @param { string } state
    */
    setState(state) {
        this.#state = state;
    }

    /**
    * The state should represent what are they up to or if they have a condition
    * @returns { string }
    */
    getState() {
        return this.#state;
    }


}

export default EntityStatus
