import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import * as THREE from "three";
import {AnimationController} from "./animationController";
import {Raycaster, Vector3} from "three";

/**
 * Control the camera movement
 */
class MovementController{

    animationController;
    controls: PointerLockControls;
    moveLeft;
    moveRight;
    moveForward;
    moveBackward;
    canJump;

    scene;
    camera;
    velocity;
    prevTime;
    direction;

    objectCollision: any[];
    raycasterY;
    raycaster;

    /**
     * @param camera
     * @param scene
     * @param animationController
     */
    constructor(camera: THREE.Camera, scene: THREE.Scene, animationController: AnimationController) {
        this.moveLeft = false;
        this.moveRight = false;
        this.moveForward = false;
        this.moveBackward = false;
        this.canJump = false;

        this.scene = scene
        this.camera = camera

        this.controls = new PointerLockControls(this.camera, document.body);
        this.animationController = animationController

        this.prevTime = performance.now();
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.objectCollision = [];
        this.raycasterY = new Raycaster(this.camera.position.clone(), new Vector3(0, -1, 0), 0, this.camera.position.y);
        this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 3 );
    }

    /**
     * gets Keyboard events and locks or unlocks the mouse
     */
    camMov() {
        const onKeyDown = (event: { code: any; }) => {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;

                case 'Space':
                    if ( this.canJump ) this.velocity.y += 40;
                    this.canJump = false;
                    break;

                case 'KeyE':
                    //interact(barSeats[1])
                    break;

            }

        };

        const onKeyUp = (event: { code: any; }) => {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':

                    this.moveForward = false;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;

            }

        };

        const blocker = document.getElementById('blocker')!;
        const instructions = document.getElementById('instructions')!;

        instructions.addEventListener('click', ()=> {

            this.controls.lock();

        });

        this.controls.addEventListener('lock', ()=> {

            instructions.style.display = 'none';
            blocker.style.display = 'none';
            this.animationController.start();
        });

        this.controls.addEventListener('unlock', () => {

            blocker.style.display = 'block';
            instructions.style.display = '';
            this.animationController.stop();

        });

        this.scene.add(this.controls.getObject());
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    }

    /**
     * updates the position of the camera
     */
    updateCamera() {

        if ( this.controls.isLocked ) {

            const time = performance.now();
            const delta = ( time - this.prevTime ) / 1000;
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;

            this.velocity.y -= 9.8 * 10.0 * delta; // 70.0 = mass

            this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
            this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
            this.direction.normalize(); // this ensures consistent movements in all directions

            if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * 8.0 * delta;

            if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * 8.0 * delta;

            this.raycaster.ray.origin.copy( this.controls.getObject().position );
            this.raycaster.ray.origin.y -= 3;

            const intersections = this.raycaster.intersectObjects( this.objectCollision, true );

            const onObject = intersections.length > 0;
            //velocity.y = Math.max( 0, velocity.y );

            if ( onObject ) {

                this.velocity.y = Math.max( 0, this.velocity.y );
                this.canJump = true;

            }
            this.controls.moveRight(-this.velocity.x);//* delta

            this.controls.moveForward(-this.velocity.z);//* delta
            this.controls.getObject().position.y += ( this.velocity.y * delta );


            if ( this.controls.getObject().position.y < 5 ) {

                this.velocity.y = 0;
                this.controls.getObject().position.y = 7;

                this.canJump = true;

            }

            if (this.controls.getObject().position.x>16.9){
                this.controls.getObject().position.x=16.9
            }

            if (this.controls.getObject().position.x<-16.9){
                this.controls.getObject().position.x=-16.9
            }

            if (this.controls.getObject().position.y>16.5){
                this.controls.getObject().position.y=16.5
            }

            if (this.controls.getObject().position.y<-16.5){
                this.controls.getObject().position.y=-16.5
            }


            this.prevTime = time;
        }




    }

    /**
     * detect collision
     * @param {THREE.Object3D} object
     */
    addObjectCollision(object: THREE.Object3D) {
        const append = (item: any) => {
            if (this.objectCollision.indexOf(item) == -1) {
                this.objectCollision.push(item);
            }
            else {
                console.error("Object alreqdy in", item);
            }
        };

        if (Array.isArray(object)) {
            object.forEach(item => {
                append(item);
            });
        }
        else {
            append(object);
        }

    }



}

export {MovementController}
