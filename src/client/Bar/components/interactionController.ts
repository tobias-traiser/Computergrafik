import {Event, Object3D, Raycaster, Vector2, Vector3} from "three";
import {int} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

/**
 * this class helps with the interaction with objects
 */
class InteractionController {
    raycaster;
    camera;
    pointer;
    interactionObjects: any[];
    interactionFunctions;
    eventFunctions;


    /**
     * @param {THREE.Camera} camera
     */
    constructor(camera: THREE.Camera) {
        this.interactionObjects = [];
        this.interactionFunctions = new Map();
        this.camera = camera;
        this.raycaster = new Raycaster(new Vector3(), new Vector3(1, 0, 0), 0, 10);
        this.pointer = new Vector2(0, 0);
        this.eventFunctions = new Map();

    }

    addInteraction(object: Object3D, interactionFunction: () => void, event: string, eventFunction: (ev: { code: any }) => void) {
        this.interactionObjects.push(object);
        this.interactionFunctions.set(object.uuid, interactionFunction)
        this.eventFunctions.set(object.uuid, {"event": event, "eventFunction": eventFunction})
    }


    removeInteraction(object: Object3D) {
        this.interactionFunctions.delete(object.uuid)
        this.eventFunctions.delete(object.uuid)

        const index = this.interactionObjects.indexOf(object);
        if (index >= 0) {
            this.interactionObjects.splice(index, 1);
        }
    }


    /**
     * checks if an interaction is now possible
     */
    checkInteractions() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactionObjects, false);
        console.log(intersects)
        // range intersection
        let funct;
        if (intersects.length > 0) {
            const object = intersects[0];

            if (object && object.object) {
                console.log(object.object.name)

                funct = this.interactionFunctions.get(object.object.uuid)
                funct()
            }

        }
    }
}
export {InteractionController}
