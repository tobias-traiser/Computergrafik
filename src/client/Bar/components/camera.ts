import {PerspectiveCamera, Vector3} from "three";


function createCamera(startPosition= new Vector3(0, 0, 0)) {
    const camera = new PerspectiveCamera();
    camera.position.x = startPosition.x;
    camera.position.y = startPosition.y;
    camera.position.z = startPosition.z;
    return camera;
}

export { createCamera };
