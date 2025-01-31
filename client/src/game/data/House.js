import Building from "./models/Building";

class House extends Building {
    constructor(x, y, width, height, id, color, sprite){
        super(x, y, width, height, id, color, sprite)
    }
    draw(ctx, camera){
        super.draw(ctx, camera)
    }
}

export default House;
