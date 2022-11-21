import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {createCamera} from "./components/camera";
import {Vector3} from "three";
import {createPointLight} from "./components/light";
import {MovementController} from "./components/movement";
import {AnimationController} from "./components/animationController";
import {SlotMachine} from "./components/slotMachine";
import {InteractionController} from "./components/interactionController";
import {Can} from "./components/can";

/**
 * This is the Bar
 */
class Bar {
    camera;
    renderer;
    scene;
    light;
    movementController;
    animationController;
    interactionController;
    slotMachine;

    seats: THREE.Object3D<THREE.Event>[] = [];
    can;

    /**
     * initialising the needed objects for the bar
     */
    constructor() {

        this.camera = createCamera(new Vector3(0,7,15));
        this.scene = new THREE.Scene();
        this.light = createPointLight(new Vector3(0, 15, 0))

        this.renderer = new THREE.WebGLRenderer({powerPreference: "high-performance", antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.interactionController = new InteractionController(this.camera)

        this.slotMachine = new SlotMachine()

        this.animationController = new AnimationController(this.camera, this.renderer, this.scene, this)


        this.movementController = new MovementController(this.camera, this.scene, this.animationController)
        this.movementController.camMov()

        this.can = new Can()
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    /**
     * updates the program if window resized
     */
    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth , window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    /**
     * load the models from glb file
     */
    async init() {
        const loader = new GLTFLoader();
        loader.load('models/bar.glb', (gltf) => {
            document.getElementById("info")!.hidden = true
            document.getElementById("blocker")!.hidden = false
            this.scene.add(gltf.scene);

            this.slotMachine.slotMachineRoles.push( gltf.scene.getObjectByName("SpielautomatRolle1"),
                gltf.scene.getObjectByName("SpielautomatRolle2"),
                gltf.scene.getObjectByName("SpielautomatRolle3"));

            this.slotMachine.slotMachineHandle = gltf.scene.getObjectByName("Sphere")
            console.log(this.slotMachine.slotMachineHandle)
            this.seats.push( gltf.scene.getObjectByName("BarSeat1")!,
                gltf.scene.getObjectByName("Bar_Stühle001")!,
                gltf.scene.getObjectByName("Bar_Stühle002")!,
                gltf.scene.getObjectByName("Bar_Stühle003")!,
                gltf.scene.getObjectByName("chair1")!,
                gltf.scene.getObjectByName("chair2")!,
                gltf.scene.getObjectByName("chair3")!);

            this.seats.forEach(seat =>{
                seat.traverse( (child) =>{
                        child.castShadow=true
                    })

            })


            gltf.scene.getObjectByName("tablepart1")!.castShadow = true
            gltf.scene.getObjectByName("tablepart2")!.castShadow = true

            gltf.scene.getObjectByName("Floor")!.receiveShadow = true
            gltf.scene.getObjectByName("LeftWall")!.receiveShadow = true
            gltf.scene.getObjectByName("rightWall")!.receiveShadow = true
            gltf.scene.getObjectByName("BackWall")!.receiveShadow = true

            gltf.scene.getObjectByName("Bartresen")!.castShadow = true
            gltf.scene.getObjectByName("Spielautomat_Basis")!.receiveShadow = true
            gltf.scene.getObjectByName("Spielautomat_Basis")!.castShadow = true
            gltf.scene.getObjectByName("deckenBarStein")!.castShadow = true

          //  this.dose = gltf.scene.getObjectByName("Can")

                //ddocument.addEventListener("click", objectClicked)
            //gltf.animations; // Array<THREE.AnimationClip>
            //gltf.scene; // THREE.Group
            //gltf.scenes; // Array<THREE.Group>
            //gltf.cameras; // Array<THREE.Camera>
            //gltf.asset; // Object

            console.log(this.scene.children)

            this.scene.children.forEach(object=>{this.movementController.addObjectCollision(object)})


            // slot machine
            const slotMachineInteraction = (ev: KeyboardEvent ) => {
                switch (ev.code) {
                    case 'KeyE':
                        this.interactionController.removeInteraction(this.slotMachine.slotMachineHandle!);
                        this.animationController.animatedObjects.push(this.slotMachine);
                        this.setText("&#8977;");
                        setTimeout(()=>{ this.animationController.animatedObjects.pop();
                            this.interactionController.addInteraction(this.slotMachine.slotMachineHandle!, this.slotMachine.setText, "keydown", slotMachineInteraction);
                        } , 7000)

                }
            };
            this.interactionController.addInteraction(this.slotMachine.slotMachineHandle!, this.slotMachine.setText, "keydown", slotMachineInteraction);



        }, undefined, function (error) {

            console.error(error);

        });

        this.scene.add(this.light);
    }

    /**
     * updates the scene every frame
     */
    render(){
        this.interactionController.checkInteractions()
        this.movementController.updateCamera()
        //this.movementController.checkBottomTopCollision()
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Sets interaction text
     * @param {String} text the text to show
     */
    setText(text: string) {
        let div = document.getElementById("point")!;
        div.innerHTML = text;
    }


    /**
     * starts the animation
     */
    start() {
        this.animationController.start()
    }
}
export { Bar };


