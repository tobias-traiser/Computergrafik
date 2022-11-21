import {Raycaster, Vector2, Vector3} from "three";

/**
 * this class helps with the interaction with objects
 */
class InteractionController {
    raycaster;
    camera;
    pointer;
    interactionObjects: any[];

    /**
     * @param {THREE.Camera} camera
     */
    constructor(camera: THREE.Camera) {
        this.interactionObjects = [];
        this.camera = camera;
        this.raycaster = new Raycaster(new Vector3(), new Vector3(1, 0, 0), 0, 10);
        this.pointer = new Vector2(0, 0);
    }

    /**
     * checks if an interaction is now possible
     */
    checkInteractions() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactionObjects, false);
        console.log(intersects)
        // range intersection
        if (intersects.length > 0) {
            const object = intersects[0];

            if (object && object.object) {
                console.log(object.object.name)
            }

        }
    }
}
export {InteractionController}
