import * as THREE from 'three';
import { FontLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import DrawAxis from './graph/axis';
import './style.css';

declare const window: any;
(new FontLoader()).load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (f) {
  window.graph = {};
  window.graph.font = f;


  const canvas = document.createElement('canvas');
  document.getElementById('app')?.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  const controls = new OrbitControls(camera, renderer.domElement);

  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(0, 10, 50);
  controls.update();
  // camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();

  const dAxes = new DrawAxis({
    x: {
      from: -10,
      to: 10,
      step: 2,
      label: [
        { name: 'New York', color: 0xff0000 },
        { name: 'Moscow', color: 0x00ff00 },
        { name: 'London', color: 0x0000ff },
        { name: 'Paris', color: 0xffff00 },
        { name: 'Berlin', color: 0x00ffff },
        { name: 'Tokyo', color: 0xff00ff },
        { name: 'Beijing', color: 0x000000 },
        { name: 'Sydney', color: 0xdedede },
        { name: 'Cairo', color: 0x808080 },
        { name: 'Rio de Janeiro', color: 0x800000 }
      ]
    },
    y: {
      from: -10,
      to: 10,
      step: 2,
      label: 'numeric'
    },
    z: {
      from: -10,
      to: 10,
      step: 2,
      label: 'numeric'
    }
  });
  scene.add(dAxes.build());

  // const bar = drawBar({
  //   width: 1,
  //   height: 5,
  //   depth: 1,
  //   position: { x: 1.7, y: 2.5, z: 0 },
  //   animate: true,
  // }, scene);

  // const bar2 = drawBar({
  //   width: 1,
  //   height: 5,
  //   depth: 1,
  //   position: { x: -1.7, y: 2.5, z: 0 },
  //   color: 0xff0000,
  //   animate: true,
  // }, scene);

  scene.background = new THREE.Color(0xffffff);
  renderer.render(scene, camera);

  // draw a sphere
  // const geometry = new THREE.SphereGeometry(1, 32, 32);
  // const material = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 150, flatShading: true });
  // const sphere = new THREE.Mesh(geometry, material);
  // sphere.position.set(5, 5, 0);
  // scene.add(sphere);

  // lights
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 5, 5);
  scene.add(light);

  function animate() {

    requestAnimationFrame(animate);
    // bar();
    // bar2();

    // sphere.rotateY(0.01);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render(scene, camera);

  }
  animate();
});
