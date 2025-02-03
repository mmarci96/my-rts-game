import Player from "../../data/Player"
import Unit from "../../data/Unit"
import Building from "../../data/models/Building"
import Selectable from "../../data/models/Selectable"

class Overlay {
    #overlayDiv
    #currentPlayer
    #isVisible

    constructor(currentPlayer) {
        if (!(currentPlayer instanceof Player)) {
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

    displayUnitSelection(selectedList) {
        console.log(selectedList)
        this.#overlayDiv.innerHTML = "";

        const units = new Set()
        const buildings = new Set()
        const selectionDetails = document.createElement("ul")
        selectionDetails.id = "selectionList"
        selectionDetails.style.display = "flex"
        this.#overlayDiv.appendChild(selectionDetails);
        selectedList.forEach(selectedEntity => {
            if (!(selectedEntity.selectable instanceof Selectable)) {
                throw new TypeError("How did you even select this?")
            }
            if (selectedEntity instanceof Unit) {
                units.add(selectedEntity)
            } else if (selectedEntity instanceof Building) {
                buildings.add(selectedEntity)
            }

        })
        if (!units.size && !buildings.size) {
            return;
        }

        if (!units.size && buildings.size === 1) {
            console.log("Display the buildings controls")
            this.displaySelection(buildings, selectionDetails)
            return;
        }

        if (buildings.size) {
            this.displaySelection(buildings, selectionDetails)
        }

        this.displaySelection(units, selectionDetails)
    }

    displaySelection(selectionList, selectionDetails) {
        selectionList.forEach(unit => {
            //if(!(unit instanceof Unit)){
            //    throw new TypeError("not unit")
            //}
            const hp = unit.getHealth()
            const maxHp = unit.getMaxHealth()
            const type = unit.getClassName()
            const unitElement = this.createUnitCard(type, hp, maxHp)
            selectionDetails.appendChild(unitElement)
        })
    }


    createUnitCard(unitType, currentHp, maxHp) {
        const unitCard = document.createElement("li");
        unitCard.classList.add("unit-card"); // Add a class for styling

        const healthContainer = document.createElement("div");
        healthContainer.classList.add("health-container");

        const healthText = document.createElement("span");
        healthText.textContent = `HP: ${currentHp}/${maxHp}`;
        healthText.classList.add("health-text");

        const healthBarContainer = document.createElement("div");
        healthBarContainer.classList.add("health-bar-container");

        const healthBar = document.createElement("div");
        healthBar.classList.add("health-bar");

        const healthPercentage = (currentHp / maxHp) * 100;
        healthBar.style.width = `${healthPercentage}%`;

        healthBarContainer.appendChild(healthBar);
        healthContainer.appendChild(healthText);
        healthContainer.appendChild(healthBarContainer);
        unitCard.appendChild(healthContainer);

        const typeText = document.createElement("div");
        typeText.classList.add("unit-type");
        typeText.textContent = unitType;
        unitCard.appendChild(typeText);

        return unitCard;
    }


}

export default Overlay
