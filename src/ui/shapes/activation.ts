import { Draggable } from "./draggable";
import { Point, Rectangle } from "./shape";
import { ActivationLayer } from "./layer";
import { windowProperties } from "../window";

export abstract class Activation extends Draggable {

    layer: ActivationLayer = null;
    abstract activationType: String;
    defaultLocation: Point = new Point(50,150);

    constructor(color: string) { 
        super();
        let middleTooth: Rectangle = new Rectangle(new Point(0, 0), 10, 10, color);
        let lowerBlock: Rectangle = new Rectangle(new Point(-8, 10), 26, 10, color);

        this.svgComponent.call(lowerBlock.svgAppender.bind(lowerBlock))
        this.svgComponent.call(middleTooth.svgAppender.bind(middleTooth))

        this.makeDraggable() 
    }

    public dragAction(d) {
        // Find the closest layer and its distances
        let minDist = Infinity
        let closestLayer: ActivationLayer = null
        for (let activationLayer of windowProperties.activationLayers) {
            let dist = activationLayer.getPosition().distance(this.getPosition())
            if (dist < minDist) {
                minDist = dist
                closestLayer = activationLayer
            }
        }

        // Snap activations if they are close enough
        let snappingDistance = 20
        if (minDist < snappingDistance) {
            // if snap happens remove old connection
            if (this.layer != null) {
                this.layer.removeActivation()
                this.layer = null
            } 
            closestLayer.addActivation(this)
            this.layer = closestLayer
        } else if (this.layer != null) { // otherwise, if we unsnap update as appropriate
            this.layer.removeActivation()
            this.layer = null
        }
    }


}

export class Relu extends Activation {
    activationType = "relu"

    constructor() {
        super("#B29F9C")
    }

    getHoverText(): string { return "relu" }

}

export class Sigmoid extends Activation {
    activationType = "sigmoid"

    constructor() {
        super("#F2A878")
    }

    getHoverText(): string { return "sigmoid" }

}

export class Tanh extends Activation {
    activationType = "tanh"
    
    constructor() {
        super("#A3A66D")
    }

    getHoverText(): string { return "tanh" }
}
