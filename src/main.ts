import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Graph from './objects/Axis';
import './style.css';
import Bar from './objects/Bar';
import HoverActions from './effect/HoverObject';


const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app')?.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
const controls = new OrbitControls(camera, renderer.domElement);
// look at centre of the graph
controls.target.set(0, 0, 0);
// set camera position
camera.position.set(10, 10, 20);
controls.update();

const scene = new THREE.Scene();

const graph = new Graph({
  axes: {
    x: { from: -10, to: 10, step: 2, label: 'numeric' },
    y: { from: -10, to: 10, step: 2, label: 'numeric' },
    z: { from: -10, to: 10, step: 2, label: 'numeric' },
  }
});

const bar = new Bar({
  width: 1,
  height: 2,
  depth: 1,
  barType: '+y'
}, new THREE.Vector3(2, 0, 0), 0x00ff00, false, 0x000000, 2);
scene.add(bar);

const bar2 = new Bar({
  width: 1,
  height: 2,
  depth: 1,
  barType: '+y'
}, new THREE.Vector3(4, 0, 0), 0x00ff00, false, 0x000000, 2);
bar2.rotate();
scene.add(bar2);

const bar3 = new Bar({
  width: 1,
  height: 2,
  depth: 1,
  barType: '+x'
}, new THREE.Vector3(0, 4, 0), 0x00ff00, false, 0x000000, 2);
scene.add(bar3);

const bar4 = new Bar({
  width: 1,
  height: 2,
  depth: 1,
  barType: '-x'
}, new THREE.Vector3(0, 6, 0), 0x00ff00, false, 0x000000, 2);
scene.add(bar4);

HoverActions(renderer, camera, scene);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
onWindowResize();


scene.add(graph);

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
  // bar4.rotate();
}
animate();
