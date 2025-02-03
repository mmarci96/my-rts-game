class Action {
    constructor(name, durationInSeconds) {
        this.name = name;
        this.duration = durationInSeconds * 1000;
        this.createdAt = Date.now()
    }
    isReady() {
        return (Date.now() - this.createdAt) >= this.duration;
    }
}
