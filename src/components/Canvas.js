import React, { Component } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import Stats from 'three/examples/jsm/libs/stats.module.js';
//import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

class Canvas extends Component {
    componentDidMount() {

        let scene,
            renderer,
            camera,
            model,                              // Our character
            mixer,                              // THREE.js animations mixer
            walking,                            // Idle, the default state our character returns to
            clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
            white = 0xFFFFFF,
            //black = 0x000000,
            ortoCameraFrustum = 128,             // Blurs dirLight Shadows
            backgroundColor = white;
            //width = window.innerWidth,
            //height = window.innerHeight;


        const ruletikMaterial = new THREE.MeshPhongMaterial({
            color: 0xF7F7F7,
            skinning: true
        });


        var gltfLoader = new GLTFLoader();
        scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);
        //scene.fog = new THREE.Fog(backgroundColor, 30, 100);  //крутой туман

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;
        camera.position.x = 40;
        camera.position.y = 20;


        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.mount.appendChild(renderer.domElement);


        //----------------------------------------    Lightning Setup  ---------------------------------//
        var globalLight = new THREE.AmbientLight(0xCECECE);  //Global Light without direction
        scene.add(globalLight);


        let dirLightTop = new THREE.DirectionalLight(0xffffff, 0.3);
        dirLightTop.position.set(70, 128, 90);
        dirLightTop.castShadow = true;
        dirLightTop.shadow.camera = new THREE.OrthographicCamera(-ortoCameraFrustum, ortoCameraFrustum, ortoCameraFrustum, -ortoCameraFrustum, 0.1, 1000);
        dirLightTop.shadow.mapSize.width = 4096; // default is 512
        dirLightTop.shadow.mapSize.height = 4096;
        dirLightTop.shadow.radius = 256;

        let dirLightBottom = new THREE.DirectionalLight(0xffffff, 0.2);
        dirLightBottom.position.set(70, 1, 90);
        dirLightBottom.castShadow = true;

        // Add directional Light to scene
        scene.add(dirLightTop, dirLightBottom);
        //scene.add(new THREE.CameraHelper(dirLightTop.shadow.camera));
        //scene.add(new THREE.CameraHelper(camera));
        //scene.add(new THREE.DirectionalLightHelper(dirLightTop));



        //----------------------------------------    Create Floor   ---------------------------------//
        let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
        let floorMaterial = new THREE.MeshPhongMaterial({
            color: white,
            shininess: 0,
        });

        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
        floor.receiveShadow = true;
        floor.position.y = -1;
        scene.add(floor);


        //----------------------------------------    Loading Model   ---------------------------------//
        const MODEL_PATH = './RuletikLegoRig.glb';
        gltfLoader.load(MODEL_PATH, gltf => {

            model = gltf.scene;
            let fileAnimations = gltf.animations;

            model.traverse(o => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                    o.material = ruletikMaterial;
                    o.material.shading = THREE.SmoothShading;
                }
            });

            model.scale.set(1, 1, 1);
            model.position.y = 0;
            model.rotation.y = 0.16 * Math.PI;

            mixer = new THREE.AnimationMixer(model);
            let walkingAnim = THREE.AnimationClip.findByName(fileAnimations, 'Walking');
            walking = mixer.clipAction(walkingAnim);
            walking.play();

            scene.add(model);

        });


        //----------------------------------------    SSAO  ---------------------------------//
       // var container, stats;

       // container = document.createElement('div');
        //document.body.appendChild(container);


       // stats = new Stats();
        //container.appendChild(stats.dom); // FPS stats container

        //----------------------------------------    windowResize   ---------------------------------//

        window.addEventListener('resize', onWindowResize, false);



        //----------------------------------------    Main Animation   ---------------------------------//		

        function animate() {

            requestAnimationFrame(animate);

            var delta = clock.getDelta();
            if (mixer) mixer.update(delta);

            
            renderer.render(scene, camera);
            
        }



        function onWindowResize() {

            var width = window.innerWidth;
            var height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            //composer.setSize(width, height);
        }

        animate();

    }



    //----------------------------------------    React Render DOM  ---------------------------------//	
    render() {
        return (
            <div ref={ref => (this.mount = ref)} />
        )
    }

}

export default Canvas