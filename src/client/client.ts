import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {Raycaster} from "three";


let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, controls: PointerLockControls;
const loader = new GLTFLoader();


let moveLeft = false;
let moveRight = false;
let moveForward = false;
let moveBackward = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let slotMachineRoles: (THREE.Object3D<THREE.Event> | undefined)[] = [];
let barSeats: THREE.Object3D<THREE.Event>[] = [];

init();



function init(){
    camera = new THREE.PerspectiveCamera();
    scene = new THREE.Scene();

    loader.load( 'models/bar.glb', function ( gltf ) {
        document.getElementById("info")!.hidden = true
        document.getElementById("blocker")!.hidden = false
        scene.add( gltf.scene );
        //console.log(gltf.scene.getObjectByName("SpielautomatRolle1"))
        slotMachineRoles.push( gltf.scene.getObjectByName("SpielautomatRolle1"),
            gltf.scene.getObjectByName("SpielautomatRolle2"),
            gltf.scene.getObjectByName("SpielautomatRolle3"));

        barSeats.push( gltf.scene.getObjectByName("Bar_Stühle")!, //erstes obj so nicht, nur in einzelteilen
            gltf.scene.getObjectByName("Bar_Stühle001")!,
            gltf.scene.getObjectByName("Bar_Stühle002")!,
            gltf.scene.getObjectByName("Bar_Stühle003")!);

        gltf.scene.getObjectByName("Floor")!.receiveShadow = true
        gltf.scene.getObjectByName("Bartresen")!.receiveShadow = true
        gltf.scene.getObjectByName("Bartresen")!.castShadow = true
        gltf.scene.getObjectByName("Bartresen")!.addEventListener("click",()=> {console.log("bar clicked")})
        //ddocument.addEventListener("click", objectClicked)
        //gltf.animations; // Array<THREE.AnimationClip>
        //gltf.scene; // THREE.Group
        //gltf.scenes; // Array<THREE.Group>
        //gltf.cameras; // Array<THREE.Camera>
        //gltf.asset; // Object
        console.log(scene.children)


    }, undefined, function ( error ) {

        console.error( error );

    } );

    barSeats.forEach( object => {
        object!.castShadow = true;
        object!.receiveShadow = true
    })



    //new OrbitControls(camera, renderer.domElement)
    camera.position.set(0,5,40)
    //scene.background= new THREE.Color( 0xffffff );

    const light = new THREE.PointLight( 0xFFFFFF, 2, 100 );
    light.position.set( 0, 20, 0 );
    light.castShadow = true;
    scene.add( light );

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    //Create a helper for the shadow camera (optional)
    const helper = new THREE.CameraHelper( light.shadow.camera );
    scene.add( helper );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement );

    /*var plane = new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.MeshStandardMaterial( {color: 0x00ff00 }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.position.set(0, 0, -6);
    scene.add(plane);*/

    window.addEventListener( 'resize', onWindowResize );


    // moving through the scene
    controls = new PointerLockControls( camera, document.body );

    const onKeyDown = function ( event: { code: any; } ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
                if ( canJump ) velocity.y += 40;
                canJump = false;
                break;

            case 'KeyE':
                interact(barSeats[1])
                break;

        }

    };

    const onKeyUp = function ( event: { code: any; } ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }

    };

    const blocker = document.getElementById( 'blocker' )!;
    const instructions = document.getElementById( 'instructions' )!;

    instructions.addEventListener( 'click', function () {

        controls.lock();

    } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );



    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );
    controls.getObject()
    scene.add( controls.getObject() );
    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth , window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

}
const raycaster = new THREE.Raycaster();
function interact(object: THREE.Object3D<THREE.Event>) {
    //console.log(barSeats)
    //let distance = controls.getObject().position.distanceTo(object.position)

    //raycaster.set( new THREE.Vector3(1, 0, 0), camera.position );
    raycaster.setFromCamera(new THREE.Vector2(window.innerWidth/2, window.innerHeight/2).normalize(), camera);
    console.log(new THREE.Vector2(window.innerWidth/2, window.innerHeight/2))
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {

        console.log(intersects[0].object.name);
    }
}



function animate() {
    requestAnimationFrame(animate)
    //controls.moveForward(0.01)
    if ( controls.isLocked ) {

        const time = performance.now();
        const delta = ( time - prevTime ) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 10.0 * delta; // 70.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 8.0 * delta;

        if ( moveLeft || moveRight ) velocity.x -= direction.x * 8.0 * delta;


        //velocity.y = Math.max( 0, velocity.y );

        controls.moveRight(-velocity.x);//* delta

        controls.moveForward(-velocity.z);//* delta
        controls.getObject().position.y += ( velocity.y * delta );

        if ( controls.getObject().position.y < 5 ) {

            velocity.y = 0;
            controls.getObject().position.y = 5;

            canJump = true;

        }

        prevTime = time;



        //animate slot machine

        slotMachineRoles[0]?.rotateY(delta + Math.random() / 10)
        slotMachineRoles[1]?.rotateY(delta + Math.random() / 10)
        slotMachineRoles[2]?.rotateY(delta + Math.random() / 10)
    }
    render()
}

function render() {
    //renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.render(scene, camera)
}

animate()
