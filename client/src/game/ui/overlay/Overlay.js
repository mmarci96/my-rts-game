import Player from "../../data/Player"
import Unit from "../../data/Unit"
import Building from "../../data/models/Building"
import Selectable from "../../data/models/Selectable"

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

    displayUnitSelection(selectedList){
        console.log(selectedList)
        const units = new Set()
        const buildings = new Set()
        selectedList.forEach(selectedEntity => {
            if(!(selectedEntity.selectable instanceof Selectable)){
                throw new TypeError("How did you even select this?")
            }
            if(selectedEntity instanceof Unit){
                units.add(selectedEntity)
            } else if (selectedEntity instanceof Building){
                buildings.add(selectedEntity)
            }
            
        })
        if(!units.size && !buildings.size){
            console.log("nothing is selected!")
            this.#overlayDiv.innerHTML = "";
        }
        if(units.size && !buildings.size){
            console.log("only units are selected!")
            const selectionDetails = document.createElement("ul")
            selectionDetails.id = "selectionList"
            selectionDetails.style.display = "flex"
            this.#overlayDiv.appendChild(selectionDetails);
            units.forEach(unit => {
                if(!(unit instanceof Unit)){
                    throw new TypeError("not unit")
                }
                const unitElement = document.createElement("li")
                selectionDetails.appendChild(unitElement)
                unitElement.textContent = "Health: " + unit.getHealth()
            })
        }
    }


}

export default Overlay
