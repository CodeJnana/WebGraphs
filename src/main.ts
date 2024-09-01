import './style.css';
import DrawAxis from './graph/axis';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { drawBar } from './graph/bar';

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
camera.position.set(10, 10, 50);
controls.update();
// camera.position.set(0, 0, 50);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

const dAxes = new DrawAxis({
  x: {
    from: -6,
    to: 6,
    step: 2,
  },
  y: {
    from: -6,
    to: 6,
    step: 2,
  },
  z: {
    from: -6,
    to: 6,
    step: 2,
  }
});
scene.add(dAxes.build());

const bar = drawBar({
  width: 1,
  height: 5,
  depth: 1,
  position: { x: 1.7, y: 2.5, z: 0 },
  animate: true,
}, scene);

const bar2 = drawBar({
  width: 1,
  height: 5,
  depth: 1,
  position: { x: -1.7, y: 2.5, z: 0 },
  color: 0xff0000,
  animate: true,
}, scene);

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
  bar();
  bar2();

  // sphere.rotateY(0.01);
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);

}
animate();
