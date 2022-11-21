import { Clock } from 'three';
import {Bar} from "../bar";

const clock = new Clock();

/**
 * make Animation
 */
class AnimationController {

    renderer;
    camera;
    scene;
    bar;
    animatedObjects : any[];


    /**
     * @param {THREE.Camera} camera
     * @param {THREE.Scene} scene
     * @param {THREE.WebGLRenderer} renderer
     * @param bar
     */
    constructor(camera: THREE.Camera, renderer: THREE.WebGLRenderer, scene: THREE.Scene, bar: Bar) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        this.bar = bar;
        this.animatedObjects = [];
    }

    /**
     * Start animation
     */
    start() {
        this.renderer.setAnimationLoop(() => {
            this.updateAnimations();
            this.bar.render();
            this.renderer.render(this.scene, this.camera);
        });
    }

    /**
     * Update animation
     */
    updateAnimations() {
        const delta = clock.getDelta();
        for (const object of this.animatedObjects) {
            object.update(delta);
        }
    }

    /**
     * Stop animation
     */
    stop() {
        this.renderer.setAnimationLoop(null);
    }
}

export { AnimationController };
