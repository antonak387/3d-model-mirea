import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import sky2 from '../img/sky2.jpg';

function App() {
  useEffect(() => {
    const myModelUrl = new URL('../assets/myModel.glb', import.meta.url);

    const renderer = new THREE.WebGLRenderer();

    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const orbit = new OrbitControls(camera, renderer.domElement);

    camera.position.set(3, 10, 10);
    orbit.update();

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    scene.add(spotLight);
    spotLight.position.set(100, 100, 0);
    spotLight.castShadow = true;
    spotLight.angle = 0.5;

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    scene.background = cubeTextureLoader.load([
      sky2,
      sky2,
      sky2,
      sky2,
      sky2,
      sky2
    ]);

    const assetLoader = new GLTFLoader();
    assetLoader.load(
      myModelUrl.href,
      function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        model.castShadow = true;
        model.position.set(0, 0, 0);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    const gui = new dat.GUI();

    const options = {
      intensity: 1
    };

    gui.add(options, 'intensity', 0, 1);

    function animate() {
      spotLight.intensity = options.intensity;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, []);

  return null;
}

export default App;
