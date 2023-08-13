import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyGui } from './my_gui.js';
import { fogParsVert, fogVert, fogParsFrag, fogFrag } from "./FogReplace";
const loader = new GLTFLoader();
const FileLoader = new THREE.FileLoader();

// Create renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var params = {
  fogNearColor: 0xd4d4d4,
  fogHorizonColor: 0x949292,
  fogDensity: 0.0025,
  fogNoiseSpeed: 13.0,
  fogNoiseFreq: .011,
  fogNoiseImpact: 1.0
};

// Add fog
//var fog = new THREE.FogExp2( 0xffffff, 0.01 );
//scene.fog = fog;

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(params.fogHorizonColor);
scene.fog = new THREE.FogExp2(params.fogHorizonColor, params.fogDensity);

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
controls.target.x = 5.0;
controls.target.y = 5.0; 
controls.target.z = 5.0; 

// Create clock
const clock = new THREE.Clock();
clock.start();

// Create lights
//var l1_light = new THREE.HemisphereLight(16777215,4473924);
//scene.add(l1_light);
//l1_light.position.set(0,20,0);
//var l2_light = new THREE.DirectionalLight(16777215);
//scene.add(l2_light);
//l2_light.position.set(-3,10,-10);

// Add objects and GUI
renderer.localClippingEnabled = true;
var local_plane_x = new THREE.Plane( new THREE.Vector3( -1.0, 0.0, 0.0 ), 256.98 );
var local_plane_y = new THREE.Plane( new THREE.Vector3( 0.0, -1.0, 0.0 ), 52.54 );
var local_plane_z = new THREE.Plane( new THREE.Vector3( 0.0, 0.0, 1.0 ), 176.66 );

// GUI
const gui = new MyGui();
gui.add_plane_controls(
    {plane: local_plane_x, low: -6.79, high: 256.98},
    {plane: local_plane_y, low: 2.85, high: 52.54},
    {plane: local_plane_z, low: -10.71, high: 176.66},
);

const vert = await FileLoader.loadAsync("building_mat.vert");
const frag = await FileLoader.loadAsync("building_mat.frag");

const building_material = new THREE.ShaderMaterial({
    uniforms: {
        time: {value: 0.0},
        resolution: {value: new THREE.Vector2(1.0, 1.0)}
    },
    vertexShader: vert,
    fragmentShader: frag,
})

const clipped_material = new THREE.MeshPhongMaterial({
    color: 0x1a3736,
    emissive: 0x000000,
    shininess: 62.0,
});

var clipped_material_shader;
clipped_material.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace(
      `#include <fog_pars_vertex>`,
      fogParsVert
    );
    shader.vertexShader = shader.vertexShader.replace(
      `#include <fog_vertex>`,
      fogVert
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <fog_pars_fragment>`,
      fogParsFrag
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <fog_fragment>`,
      fogFrag
    );

    const uniforms = ({
      fogNearColor: { value: new THREE.Color(params.fogNearColor) },
      fogNoiseFreq: { value: params.fogNoiseFreq },
      fogNoiseSpeed: { value: params.fogNoiseSpeed },
      fogNoiseImpact: { value: params.fogNoiseImpact },
      time: { value: 0 }
    });

    shader.uniforms = THREE.UniformsUtils.merge([shader.uniforms, uniforms]);
    clipped_material_shader = shader;
};

// Add fog
gui.add_fog_control(scene.fog, clipped_material_shader);
gui.visual_controls.add(params, "fogNoiseFreq", 0, 0.05).onChange(function() {
    clipped_material_shader.uniforms.fogNoiseFreq.value = params.fogNoiseFreq;
});
gui.visual_controls.add(params, "fogNoiseSpeed", 0.0, 100.0).onChange(function() {
    clipped_material_shader.uniforms.fogNoiseSpeed.value = params.fogNoiseSpeed;
});
gui.visual_controls.add(params, "fogNoiseImpact", 0.0, 1.0).onChange(function() {
    clipped_material_shader.uniforms.fogNoiseImpact.value = params.fogNoiseImpact;
});

loader.load(
	// resource URL
	'KowloonCityScene.glb',
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
              o.material = building_material;
              o.material.clippingPlanes = [local_plane_x, local_plane_y, local_plane_z];
              o.material.clipping = true;
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

// Load a version, but add an alpha to the material
loader.load(
	'KowloonCityScene.glb',
	function ( gltf ) {

		scene.add( gltf.scene );

        gltf.scene.traverse((o) => {       
            if (o.isMesh) {
                o.material = clipped_material;
                o.material.opacity = 0.6;
                o.material.transparent = true;
            }
        });

        gui.add_transparency_control(gltf.scene);

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
    var time = clock.getElapsedTime();
    building_material.uniforms.time.value = time;
    if (clipped_material_shader)
    {
        clipped_material_shader.uniforms.time.value = time;
    }
};

controls.update();
render();
