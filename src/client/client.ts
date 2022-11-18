import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    150,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)


const loader = new GLTFLoader();

loader.load( 'models/testingModel.glb', function ( gltf ) {

    scene.add( gltf.scene );

    //gltf.animations; // Array<THREE.AnimationClip>
    //gltf.scene; // THREE.Group
    //gltf.scenes; // Array<THREE.Group>
    //gltf.cameras; // Array<THREE.Camera>
    //gltf.asset; // Object


}, undefined, function ( error ) {

    console.error( error );

} );

scene.background= new THREE.Color( 0xffffff );

const light = new THREE.PointLight( 0xFFFFFF, 20, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );
/*
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)*/

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    //cube.rotation.x += 0.01
    //cube.rotation.y += 0.01

    render()
}

function render() {
    //renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.render(scene, camera)
}

animate()
