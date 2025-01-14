import Building from "./models/Building";

class House extends Building {
    constructor(x, y, width, height, id, color, sprite){
        super(x, y, width, height, id, color, sprite)
    }

}

export default House;
