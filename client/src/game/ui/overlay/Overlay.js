import Player from "../../data/Player"

class Overlay {
    #overlayDiv
    #currentPlayer
    #isVisible

    constructor(currentPlayer){
        if(!(currentPlayer instanceof Player)){
            throw new TypeError("must be player")
        }
        this.#currentPlayer = currentPlayer;
        this.#overlayDiv = document.getElementById("overlay");
        this.#isVisible = false;
    }

    setVisible() {
        if (this.#overlayDiv) {
            this.#overlayDiv.style.display = "flex";
            this.#isVisible = true;
        }
    }

    setInvisible() {
        if (this.#overlayDiv) {
            this.#overlayDiv.style.display = "none";
            this.#isVisible = false;
        }
    }


}

export default Overlay
