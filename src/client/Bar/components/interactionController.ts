import {Event, Object3D, Raycaster, Vector2, Vector3} from "three";


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

    /**
     * enable interaction with an object
     * @param object
     * @param interactionFunction
     * @param event
     * @param eventFunction
     */
    addInteraction(object: Object3D, interactionFunction: () => void, event: string, eventFunction: any ) {
        this.interactionObjects.push(object);
        this.interactionFunctions.set(object.uuid, interactionFunction)
        this.eventFunctions.set(object.uuid, {"event": event, "eventFunction": eventFunction, "activated": false})
    }

    /**
     * disable to interact with an object
     * @param object
     */
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

        let div = document.getElementById("point")!;
        div.innerHTML = "&#8977;";

        if (this.eventFunctions!== undefined){
            this.eventFunctions.forEach((eventFunctionsKey)=>{
                if (eventFunctionsKey["activated"]) {
                    document.body.removeEventListener(eventFunctionsKey["event"], eventFunctionsKey["eventFunction"]);
                    eventFunctionsKey["activated"] = false;
                }})
        }

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactionObjects, false);

        //console.log(intersects)

        if (intersects.length > 0) {
            const object = intersects[0];

            if (object && object.object) {
                //console.log(object.object.name)

                this.interactionFunctions.get(object.object.uuid)()
                if (this.eventFunctions.get(object.object.uuid)["activated"] === false && this.eventFunctions.get(object.object.uuid)["event"]) {

                    document.addEventListener(this.eventFunctions.get(object.object.uuid)["event"], (event) => {
                        if (this.eventFunctions.get(object.object.uuid) != undefined) {
                            this.eventFunctions.get(object.object.uuid)["eventFunction"](event);
                        }
                    });
                    this.eventFunctions.get(object.object.uuid)["activated"] = true
                }


            }

        }


    }
}
export {InteractionController}
