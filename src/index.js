import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GodRaysEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect } from 'postprocessing';

class App extends Component {
	componentDidMount() {
		
		// === THREE.JS CODE START ===
		
		var mixer;
		var gltfLoader = new GLTFLoader();
		var scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x080808 );

		var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
		camera.position.set( 0, 25, 350 );
		//camera.lookAt( scene.position );



		var renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		this.mount.appendChild( renderer.domElement );

		//var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
		//hemiLight.position.set( 0, 20, 0 );
		//scene.add( hemiLight );

		var dirLight = new THREE.DirectionalLight( 0x208FFD, 5);
		dirLight.position.set( 0, 0, -1 );
		scene.add( dirLight );



		//CREATE CIRCLE
		let circleGeo = new THREE.CircleGeometry(150,50);
    	let circleMat = new THREE.MeshBasicMaterial({color: 0x208FFD});
    	let circle = new THREE.Mesh(circleGeo, circleMat);
    	circle.position.set(0, 50 ,-500);
    	circle.scale.setX(1);
    	scene.add(circle);



    	//POST-PROCESSING EFFECTS
	    let areaImage = new Image();
	        areaImage.src = SMAAEffect.areaImageDataURL;
	    let searchImage = new Image();
	        searchImage.src = SMAAEffect.searchImageDataURL;
	    let smaaEffect = new SMAAEffect(searchImage,areaImage,1);
	  

    	let godraysEffect = new GodRaysEffect(camera, circle, {
      		resolutionScale: 1,
      		density: 0.5,
      		decay: 0.96,
      		weight: 0.5,
      		samples: 84
    	});


    	let renderPass = new RenderPass(scene, camera);
    	let effectPass = new EffectPass(camera,smaaEffect,godraysEffect);
    	effectPass.renderToScreen = true;
		

    	let composer = new EffectComposer(renderer);
    	composer.addPass(renderPass);
    	composer.addPass(effectPass);



		//LOAD 3D MODEL
		gltfLoader.load( './isometric-ruletik-test.glb', gltf => {
			
			var ruletikLogo = gltf.scene.children[0];
			ruletikLogo.scale.set(130,130,130);
			scene.add(gltf.scene);

			mixer = new THREE.AnimationMixer( gltf.scene );
			mixer.clipAction( gltf.animations[ 0 ] ).play();

		} );




		//const controls = new OrbitControls( camera, renderer.domElement );

		const clock = new THREE.Clock();

		function animate() {



			requestAnimationFrame( animate );

			var delta = clock.getDelta();

			if ( mixer ) mixer.update( delta );

			renderer.render(scene,camera);
			composer.render(0.1);

		}

		animate();

		// === THREE.JS EXAMPLE CODE END ===

	}

	render() {
		return (
			<div ref={ref => (this.mount = ref)} />
		)
	}
}

export default App

ReactDOM.render(<App />, document.getElementById('root'))