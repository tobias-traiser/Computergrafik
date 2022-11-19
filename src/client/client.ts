import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";

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


init();
function init(){
    camera = new THREE.PerspectiveCamera();
    scene = new THREE.Scene();

    loader.load( 'models/bar.glb', function ( gltf ) {
        document.getElementById("info")!.hidden = true
        document.getElementById("blocker")!.hidden = false
        scene.add( gltf.scene );

        //gltf.animations; // Array<THREE.AnimationClip>
        //gltf.scene; // THREE.Group
        //gltf.scenes; // Array<THREE.Group>
        //gltf.cameras; // Array<THREE.Camera>
        //gltf.asset; // Object


    }, undefined, function ( error ) {

        console.error( error );

    } );




    //new OrbitControls(camera, renderer.domElement)
    camera.position.set(0,5,40)
    //scene.background= new THREE.Color( 0xffffff );

    const light = new THREE.PointLight( 0xFFFFFF, 20, 100 );
    light.position.set( 50, 50, 50 );
    scene.add( light );




    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

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

    renderer.setSize( window.innerWidth, window.innerHeight );

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
        console.log(velocity)
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

    }
    render()
}

function render() {
    //renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.render(scene, camera)
}

animate()
