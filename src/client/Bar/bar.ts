import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class Bar {
    camera;
    renderer;
    scene;
    controller;
    controls: PointerLockControls;
    moveLeft;
    moveRight;
    moveForward;
    moveBackward;
    canJump;
    prevTime;
    velocity;
    direction;


    constructor() {

        this.camera = new THREE.PerspectiveCamera();
        this.scene = new THREE.Scene();

        this.camera.position.set(0,5,40)

        this.controls = new PointerLockControls(this.camera, document.body);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.controller = this.camMov();

        this.moveLeft = false;
        this.moveRight = false;
        this.moveForward = false;
        this.moveBackward = false;
        this.canJump = false;

        this.prevTime = performance.now();
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }


    camMov(this: any) {


        // moving through the scene


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

        });


        this.controls.addEventListener('unlock', () => {

            blocker.style.display = 'block';
            instructions.style.display = '';

        });
        //this.controls.getObject()
        this.scene.add(this.controls.getObject());
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    }

    async init() {
        const loader = new GLTFLoader();
        loader.load('models/bar.glb', (gltf) => {
            document.getElementById("info")!.hidden = true
            document.getElementById("blocker")!.hidden = false
            this.scene.add(gltf.scene);
            //console.log(gltf.scene.getObjectByName("SpielautomatRolle1"))
            /*slotMachineRoles.push( gltf.scene.getObjectByName("SpielautomatRolle1"),
                gltf.scene.getObjectByName("SpielautomatRolle2"),
                gltf.scene.getObjectByName("SpielautomatRolle3"));

            barSeats.push( gltf.scene.getObjectByName("Bar_Stühle")!, //erstes obj so nicht, nur in einzelteilen
                gltf.scene.getObjectByName("Bar_Stühle001")!,
                gltf.scene.getObjectByName("Bar_Stühle002")!,
                gltf.scene.getObjectByName("Bar_Stühle003")!);*/

            gltf.scene.getObjectByName("Floor")!.receiveShadow = true
            gltf.scene.getObjectByName("Bartresen")!.receiveShadow = true
            gltf.scene.getObjectByName("Bartresen")!.castShadow = true
            gltf.scene.getObjectByName("Bartresen")!.addEventListener("click", () => {
                console.log("bar clicked")
            })
            //ddocument.addEventListener("click", objectClicked)
            //gltf.animations; // Array<THREE.AnimationClip>
            //gltf.scene; // THREE.Group
            //gltf.scenes; // Array<THREE.Group>
            //gltf.cameras; // Array<THREE.Camera>
            //gltf.asset; // Object
            console.log(this.scene.children)


        }, undefined, function (error) {

            console.error(error);

        });

        const light = new THREE.PointLight(0xFFFFFF, 2, 100);
        light.position.set(0, 20, 0);
        light.castShadow = true;
        this.scene.add(light);

        const helper = new THREE.CameraHelper( light.shadow.camera );
        this.scene.add( helper );







        //this.animate()


    }


    animate() {

        //requestAnimationFrame(this.animate)


        //let slotMachineRoles: (THREE.Object3D<THREE.Event> | undefined)[] = [];
        //let barSeats: THREE.Object3D<THREE.Event>[] = [];

        //controls.moveForward(0.01)
        if ( this.controls.isLocked ) {

            const time = performance.now();
            const delta = ( time - this.prevTime ) / 1000;
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;

            this.velocity.y -= 9.8 * 10.0 * delta; // 70.0 = mass

            this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
            this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
            this.direction.normalize(); // this ensures consistent movements in all directions
            console.log(this.controls)
            if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * 8.0 * delta;

            if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * 8.0 * delta;


            //velocity.y = Math.max( 0, velocity.y );

            this.controls.moveRight(-this.velocity.x);//* delta

            this.controls.moveForward(-this.velocity.z);//* delta
            this.controls.getObject().position.y += ( this.velocity.y * delta );

            if ( this.controls.getObject().position.y < 5 ) {

                this.velocity.y = 0;
                this.controls.getObject().position.y = 5;

                this.canJump = true;

            }

            this.prevTime = time;



            //animate slot machine

            //slotMachineRoles[0]?.rotateY(delta + Math.random() / 10)
            //slotMachineRoles[1]?.rotateY(delta + Math.random() / 10)
            //slotMachineRoles[2]?.rotateY(delta + Math.random() / 10)
        }

    }


    start() {
        this.renderer.setAnimationLoop(() => {
            this.animate()
            this.renderer.render(this.scene, this.camera);
        });
    }
}
export { Bar };


