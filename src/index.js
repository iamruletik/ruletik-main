import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class App extends Component {
  componentDidMount() {
     // === THREE.JS CODE START ===

    const width = window.innerWidth;
    const height = window.innerHeight;

    var gltfLoader = new GLTFLoader();
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
	var renderer = new THREE.WebGLRenderer();

	const ambientLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );

	//var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    
    
	gltfLoader.load( './isometric-ruletik-test.glb', gltf => {
		console.log(gltf);
 		scene.add( gltf.scene );
 		camera = gltf.cameras[ 0 ];
 		scene.add( ambientLight );
	} );


    renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.appendChild( renderer.domElement );
  
    
    var helper = new THREE.CameraHelper( camera );
	scene.add( helper );

    renderer.setClearColor(0x808080);
    renderer.render(scene,camera);
    
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





