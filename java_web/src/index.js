import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();

// Create renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create scene
const scene = new THREE.Scene();

// Create camera
var camera_per = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);
camera_per.position.z = 25;

// Create controls
const controls = new OrbitControls(camera_per, renderer.domElement);

// Create lights
var l1_light = new THREE.HemisphereLight(16777215,4473924);
scene.add(l1_light);
l1_light.position.set(0,20,0);
var l2_light = new THREE.DirectionalLight(16777215);
scene.add(l2_light);
l2_light.position.set(-3,10,-10);

// Add objects
loader.load(
	// resource URL
	'KowloonCityMesh.glb',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );
		//scene.add( gltf.asset );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

// Render Loop
var render = function () {
    // Render scene
    requestAnimationFrame(render);
    renderer.render(scene, camera_per);
};

controls.update();
render();
