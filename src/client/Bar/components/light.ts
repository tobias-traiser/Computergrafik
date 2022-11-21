import {Vector3} from "three";
import * as THREE from "three";

/**
 * Create the Point Light
 * @param {THREE.Vector3} position
 * @returns THREE.SpotLight
 */
function createPointLight(position = new Vector3(0, 0, 0)) {
    const light = new THREE.PointLight(0xFFFFFF, 2, 100);
    light.position.set(position.x, position.y, position.z);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height  = 2048;
    light.castShadow = true;
    return light;
}

export {createPointLight}
