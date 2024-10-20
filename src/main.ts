import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Axis from './objects/Axes/Axis';
import Label from './objects/Axes/Label';
import { Colors } from './objects/colors/Color';
import Settings from './settings';
import './style.css';

let height: number | undefined;
let width: number | undefined;

Settings.MODE = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';


height = document.getElementById('app')?.clientHeight;
width = document.getElementById('app')?.clientWidth;
if (!height || !width) {
  throw new Error('Height or width not found');
}
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.getElementById('app')?.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, width / height, 0.25, 375);
const controls = new OrbitControls(camera, renderer.domElement);
// look at centre of the graph
controls.target.set(0, 10, 0);
// set camera position
camera.position.set(150, 100, 200);
controls.update();

const scene = new THREE.Scene();

const aXisX = new Axis('x', -105, 105, 10);
aXisX.drawOnCoordinates(
  new Label([
    { name: 'London', distanceFromAxis: -2.5 },
    { name: 'Paris' },
    { name: `New\nYork` },
    { name: 'Tokyo' },
    { name: 'Sydney' },
    { name: 'Berlin' },
    { name: 'Rome' },
    { name: 'Moscow' },
    { name: 'Cairo' },
    { name: `Cape\nTown` },
    { name: `Rio\nde\nJaneiro` },
    { name: `Buenos\nAires` },
    { name: 'Lima', distanceFromAxis: -2.5 },
    { name: `Mexico\nCity` },
    { name: `Los\nAngeles` },
    { name: 'Toronto' },
    { name: 'Vancouver', distanceFromAxis: -2.5 },
    { name: 'Anchorage' },
    { name: 'Honolulu' },
    { name: 'Auckland' },
    { name: 'Hong Kong' },
    { name: 'Singapore' },
    { name: 'Dubai' },
    { name: 'Mumbai' }
  ], Colors.text, 1.3, true, 2.5)
);
scene.add(aXisX);

const numbericLabel = new Label(1);
const aXisY = new Axis('y', -105, 105, 10);
aXisY.drawOnCoordinates(numbericLabel);
scene.add(aXisY);

const numbericLabel2 = new Label(1, Colors.text, 1.3, false, 2.5, 0);
const aXisZ = new Axis('z', -105, 105, 10);
aXisZ.drawOnCoordinates(numbericLabel2);
scene.add(aXisZ);


scene.background = new THREE.Color(Colors.scene);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);


