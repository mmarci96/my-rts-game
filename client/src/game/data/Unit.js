import GameEntity from "./models/GameEntity.js";
import Selectable from "./models/Selectable.js";
import Movable from "./models/Movable.js";
import AnimatedSprite from "./models/AnimatedSprite.js";
import Camera from "../ui/Camera.js";
import EntityStatus from "./models/EntityStatus.js";

class Unit extends GameEntity {
    #health
    #movable

    /**
    * This unit will represent anything that's controllable by player and goes in
    * combat and moves around, pretty straightforward classes c:
    * @param { number } x
    * @param { number } y
    * @param { Image } spriteSheet
    * @param { string } id
    * @param { string } state
    * @param { number } health
    * @param { string } color
    */
    constructor(x, y, spriteSheet, id, state, health, color, speed) {
        super(x, y);
        this.selectable = new Selectable(id, color);
        this.#movable = new Movable(speed);
        this.state = new EntityStatus(state)
        this.animatedSprite = new AnimatedSprite(spriteSheet);
        this.#health = health;
    }

    /**
    * @param { CanvasRenderingContext2D } context
    * @param { number } x
    * @param { number } y
    * @param { Camera } camera
    */
    draw(context,camera, x,y,deltaTime) {
        if (!(camera instanceof Camera)) {
            throw new TypeError("Camera must be a Camera.");
        }
        if (isNaN(x) || isNaN(y)) {
            throw new TypeError("X and Y must be a number.");
        }

        if(this.#movable.isMoving()) {
            const updatedPos = this.#movable.move(super.getX(), super.getY(), deltaTime);
            super.setX(updatedPos.x);
            super.setY(updatedPos.y);
        } 
        this.animatedSprite.setAnimationType(this.getState())
        this.animatedSprite.updateAnimation(); 
        this.animatedSprite.draw(context, x, y, camera, this.selectable);
    }
    onDeath(deathAnimation){
        this.animatedSprite.setDeathAnimation(deathAnimation)
        this.animatedSprite.isDying = true;
    }

    isAnimationComplete() {
        return this.animatedSprite.isAnimationComplete;
    }

    getHealth(){
        return this.#health
    }
    
    setHealth(health){
        this.#health = health;
    }

    /**
    * @returns { string } state
    */
    getState() {
        return this.state.getState()
    }

    setState(state) {
        this.state.setState(state)
    }

    getY() {
        return super.getY();
    }

    getX() {
        return super.getX();
    }

    setSelected(selected) {
        this.selectable.select(selected)
    }

    isSelected() {
        return this.selectable.isSelected();
    }

    getId() {
        return this.selectable.getId();
    }

    /**
    * This is the method that makes units move, maybe I need to remove it
    * @param { number } x
    * @param { number } y
    */
    setTarget(x, y) {
        this.#movable.setTarget(x, y);
        const updatedPos = this.#movable.move(super.getX(), super.getY())
        super.setX(updatedPos.x);
        super.setY(updatedPos.y);
    }


    /**
    * For checking ownership in the future and to find the right colored sprite
    * @returns { string }
    */
    getColor() {
        return this.selectable.getColor();
    }

    getMaxHealth(){
        return 0;
    }

}

export default Unit;
