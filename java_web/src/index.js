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
camera_per.position.x = 200;
camera_per.position.y = 200;
camera_per.position.z = 200;

// Create controls
const controls = new OrbitControls(camera_per, renderer.domElement);
controls.target.x = 0.0;
controls.target.y = 0.0; 
controls.target.z = 0.0; 

// Create lights
var l1_light = new THREE.HemisphereLight(16777215,4473924);
scene.add(l1_light);
l1_light.position.set(0,20,0);
var l2_light = new THREE.DirectionalLight(16777215);
scene.add(l2_light);
l2_light.position.set(-3,10,-10);

// Add objects

renderer.localClippingEnabled = true;
var localPlane = new THREE.Plane( new THREE.Vector3( 100, -1, 0 ), 100 );

loader.load(
	// resource URL
	'KowloonCityMesh.glb',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		//gltf.animations; // Array<THREE.AnimationClip>
		//gltf.scene; // THREE.Group
		//gltf.scenes; // Array<THREE.Group>
		//gltf.cameras; // Array<THREE.Camera>
		//gltf.asset; // Object

        gltf.scene.traverse((o) => {       
            if (o.isMesh) {
              o.material.clippingPlanes = [localPlane];
            }
        });

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
