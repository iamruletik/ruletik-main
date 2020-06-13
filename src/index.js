import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class App extends Component {
	componentDidMount() {

	let scene,
		renderer,
		camera,
		model,                              // Our character
		neck,                               // Reference to the neck bone in the skeleton
		waist,                               // Reference to the waist bone in the skeleton
		possibleAnims,                      // Animations found in our file
		mixer,                              // THREE.js animations mixer
		walking,                               // Idle, the default state our character returns to
		clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
		currentlyAnimating = false,         // Used to check whether characters neck is being used in another anim
		raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
		backgroundColor = 0xF1F1F1,
		loaderAnim = document.getElementById('js-loader');

		

		
		const ruletikMaterial = new THREE.MeshPhongMaterial({
			color: 0xFD7E14,
			skinning: true
		});
		
		
		var gltfLoader = new GLTFLoader();
		scene = new THREE.Scene();
		scene.background = new THREE.Color(backgroundColor);
		//scene.fog = new THREE.Fog(backgroundColor, 30, 100);

		camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.z = 100;
		camera.position.x = 40;
		camera.position.y = 20;



		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		this.mount.appendChild( renderer.domElement );

		

		let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
		hemiLight.position.set(0, 50, 0);
		scene.add(hemiLight);


		let d = 8.25;
		let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
		dirLight.position.set(-8, 12, 8);
		dirLight.castShadow = true;
		dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 1500;
		dirLight.shadow.camera.left = d * -1;
		dirLight.shadow.camera.right = d;
		dirLight.shadow.camera.top = d;
		dirLight.shadow.camera.bottom = d * -1;
		// Add directional Light to scene
		scene.add(dirLight);


		// Floor
		let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
		let floorMaterial = new THREE.MeshPhongMaterial({
			color: 0xDDDDDD,
			shininess: 0,
		});

		let floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
		floor.receiveShadow = true;
		floor.position.y = -1;
		scene.add(floor);


		//LOAD 3D MODEL
		const MODEL_PATH = './RuletikLegoRig.glb';
		gltfLoader.load(MODEL_PATH, gltf => {
			
			model = gltf.scene;
			let fileAnimations = gltf.animations;
			
			model.traverse(o => {
				if (o.isBone) {
					console.log(o.name);
				}


				if (o.isMesh) {
					o.castShadow = true;
					o.receiveShadow = true;
					o.material = ruletikMaterial; 
				}
				//Reference the neck and waist bones

				
				if (o.isBone && o.name === 'Head Bone') {
					neck = o;
				}
				if (o.isBone && o.name === 'Spine Bone') {
					waist = o;
				}
			});

			model.scale.set(1, 1, 1);
			model.position.y = 0;
			model.rotation.y = 0.15 * Math.PI;

			mixer = new THREE.AnimationMixer(model);
			let walkingAnim = THREE.AnimationClip.findByName(fileAnimations, 'Walking');
			//walkingAnim.tracks.splice(0, 3);  
			//walkingAnim.tracks.splice(10, 3); 
			walking = mixer.clipAction(walkingAnim);
			walking.play();


			scene.add(model);

		} );



		function animate() {


			setTimeout(function () {

				

			


			var delta = clock.getDelta();
			if (mixer) mixer.update(delta);

			if (resizeRendererToDisplaySize(renderer)) {
				const canvas = renderer.domElement;
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();
				
			}

			renderer.render(scene,camera);
			requestAnimationFrame(animate);


			}, 500 / 8); //Custom Framerate
		}
		animate();

		function resizeRendererToDisplaySize(renderer) {
			const canvas = renderer.domElement;
			let width = window.innerWidth;
			let height = window.innerHeight;
			let canvasPixelWidth = canvas.width / window.devicePixelRatio;
			let canvasPixelHeight = canvas.height / window.devicePixelRatio;

			const needResize =
				canvasPixelWidth !== width || canvasPixelHeight !== height;
			if (needResize) {
				renderer.setSize(width, height, false);
			}

			
			return needResize;
		}

		document.addEventListener('mousemove', function (e) {
			var mousecoords = getMousePos(e);
			if (neck && waist) {
				moveJoint(mousecoords, neck, 50);
				moveJoint(mousecoords, waist, 30);
			}
		});

		function getMousePos(e) {
			return { x: e.clientX, y: e.clientY };
		}

		function moveJoint(mouse, joint, degreeLimit) {
			let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
			joint.rotation.y = THREE.Math.degToRad(degrees.x);
			joint.rotation.x = THREE.Math.degToRad(degrees.y);
		}

	}

	render() {
		return (
			<div ref={ref => (this.mount = ref)} />
		)
	}
	
}

export default App

ReactDOM.render(<App />, document.getElementById('root'))




function getMouseDegrees(x, y, degreeLimit) {
	let dx = 0,
		dy = 0,
		xdiff,
		xPercentage,
		ydiff,
		yPercentage;

	let w = { x: window.innerWidth, y: window.innerHeight };

	// Left (Rotates neck left between 0 and -degreeLimit)

	// 1. If cursor is in the left half of screen
	if (x <= w.x / 2) {
		// 2. Get the difference between middle of screen and cursor position
		xdiff = w.x / 2 - x;
		// 3. Find the percentage of that difference (percentage toward edge of screen)
		xPercentage = (xdiff / (w.x / 2)) * 100;
		// 4. Convert that to a percentage of the maximum rotation we allow for the neck
		dx = ((degreeLimit * xPercentage) / 100) * -1;
	}
	// Right (Rotates neck right between 0 and degreeLimit)
	if (x >= w.x / 2) {
		xdiff = x - w.x / 2;
		xPercentage = (xdiff / (w.x / 2)) * 100;
		dx = (degreeLimit * xPercentage) / 100;
	}
	// Up (Rotates neck up between 0 and -degreeLimit)
	if (y <= w.y / 2) {
		ydiff = w.y / 2 - y;
		yPercentage = (ydiff / (w.y / 2)) * 100;
		// Note that I cut degreeLimit in half when she looks up
		dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
	}

	// Down (Rotates neck down between 0 and degreeLimit)
	if (y >= w.y / 2) {
		ydiff = y - w.y / 2;
		yPercentage = (ydiff / (w.y / 2)) * 100;
		dy = (degreeLimit * yPercentage) / 100;
	}
	return { x: dx, y: dy };
}