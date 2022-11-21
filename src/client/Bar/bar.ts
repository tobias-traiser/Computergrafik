import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {createCamera} from "./components/camera";
import {Vector3} from "three";
import {createPointLight} from "./components/light";
import {MovementController} from "./components/movement";
import {AnimationController} from "./components/animationController";
import {SlotMachine} from "./components/slotMachine";

class Bar {
    camera;
    renderer;
    scene;
    light;
    movementController;
    animationController;
    slotMachine;

    barSeats: THREE.Object3D<THREE.Event>[] = [];

    constructor() {

        this.camera = createCamera(new Vector3(0,5,40));
        this.scene = new THREE.Scene();
        this.light = createPointLight(new Vector3(0, 20, 0))

        this.renderer = new THREE.WebGLRenderer({powerPreference: "high-performance", antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.movementController = new MovementController(this.camera, this.scene)
        this.movementController.camMov()


        this.slotMachine = new SlotMachine()


        this.animationController = new AnimationController(this.camera, this.renderer, this.scene, this)
        this.animationController.animatedObjects.push(this.slotMachine)

        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    async init() {
        const loader = new GLTFLoader();
        loader.load('models/bar.glb', (gltf) => {
            document.getElementById("info")!.hidden = true
            document.getElementById("blocker")!.hidden = false
            this.scene.add(gltf.scene);

            this.slotMachine.slotMachineRoles.push( gltf.scene.getObjectByName("SpielautomatRolle1"),
                gltf.scene.getObjectByName("SpielautomatRolle2"),
                gltf.scene.getObjectByName("SpielautomatRolle3"));

            this.barSeats.push( gltf.scene.getObjectByName("Bar_Stühle")!, //erstes obj so nicht, nur in einzelteilen
                gltf.scene.getObjectByName("Bar_Stühle001")!,
                gltf.scene.getObjectByName("Bar_Stühle002")!,
                gltf.scene.getObjectByName("Bar_Stühle003")!);

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

        this.scene.add(this.light);

        const helper = new THREE.CameraHelper( this.light.shadow.camera );
        this.scene.add( helper );

    }

    render(){
        this.movementController.updateCamera()
        this.renderer.render(this.scene, this.camera);
    }



    start() {
        this.animationController.start()
    }
}
export { Bar };


