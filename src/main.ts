import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Axis from './objects/Axes/Axis';
import Label, { TurnLabel } from './objects/Axes/AxisLabel';
import { Colors } from './objects/colors/Color';
import WebGraphsScene from './objects/WebgraphsScene';
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

const scene = new WebGraphsScene();

const aXisX = new Axis({
  name: 'x',
  from: -100,
  to: 100,
  coordinateDistance: 10,
  drawBetweenCoordinates: true,
  color: Colors.line,
  slitSize: .75,
  slitColor: Colors.line
});
const label = new Label({
  type: [
    { name: 'London' },
    { name: 'Paris' },
    { name: `New\nYork` },
    { name: 'Tokyo' },
    { name: 'Sydney' },
    { name: 'Berlin' },
    { name: 'Rome' },
    { name: 'Moscow' },
    { name: 'Cairo' },
    { name: `Cape\nTown` },
    { name: `0` },
    { name: `Rio\nde\nJaneiro` },
    { name: `Buenos\nAires` },
    { name: 'Lima' },
    { name: `Mexico\nCity` },
    { name: `Los\nAngeles` },
    { name: '.' },
    { name: 'Vancouver' },
    { name: 'Anchorage' },
    { name: 'Honolulu' },
    { name: 'Auckland' },
    { name: 'Hong Kong' },
    { name: 'Singapore' },
    { name: 'Dubai' },
    { name: 'Mumbai' }
  ],
  color: Colors.text,
  fontSize: 1.3,
  shift: { type: 'y', distance: -1.5 },
  ypr: {
    yaw: 0,
    pitch: 0,
    roll: TurnLabel.ONE
  }
});
aXisX.drawOnCoordinates(label);

const numbericLabel = new Label({
  type: 1,
  color: Colors.text,
  fontSize: 1.3,
  shift: [
    { type: 'x', distance: -1.5 },
    { type: 'y', distance: 0.5 }
  ]
});
const aXisY = new Axis({
  name: 'y',
  from: -100,
  to: 100,
  coordinateDistance: 10,
  drawBetweenCoordinates: false,
  color: Colors.line,
  slitSize: .75,
  slitColor: Colors.line
});
aXisY.drawOnCoordinates(numbericLabel);

const numbericLabel2 = new Label({
  type: 1,
  color: Colors.text,
  fontSize: 1.3,
  shift: { type: 'y', distance: -2.5 }
});
const aXisZ = new Axis({
  name: 'z',
  from: -100,
  to: 100,
  coordinateDistance: 10,
  drawBetweenCoordinates: false,
  color: Colors.line,
  slitSize: .75,
  slitColor: Colors.line
});
aXisZ.drawOnCoordinates(numbericLabel2);

// aXisX.drawParallelAxis([aXisY, aXisZ]);
// aXisY.drawParallelAxis([aXisX, aXisZ]);
// aXisZ.drawParallelAxis([aXisX, aXisY]);

scene.add(aXisX, aXisY, aXisZ);

scene.background = new THREE.Color(Colors.scene);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

function animate() {

  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);

}
animate();