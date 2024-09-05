import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';

const canvas = document.createElement('canvas');
canvas.width = 1200;
canvas.height = 600;
document.getElementById('app')?.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  precision: 'highp',
});
renderer.setSize(canvas.width, canvas.height);

const camera = new THREE.PerspectiveCamera(45, 2, 1, 500);
const controls = new OrbitControls(camera, renderer.domElement);
// look at centre of the graph
controls.target.set(10, 5, 0);
// set camera position
camera.position.set(10, 5, 15);
controls.update();

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

// lights
const light = new THREE.AmbientLight(0xffffff, 3);
light.position.set(0, 5, 5);
scene.add(light);
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
