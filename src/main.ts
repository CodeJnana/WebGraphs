import * as THREE from 'three';
import { FontLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import DrawAxis from './objects/Axis';
import Bar from './objects/Bar';
import './style.css';
import BarGraph from './graph/BarGraph';

declare const window: any;
(new FontLoader()).load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (f) {
  window.graph = {};
  window.graph.font = f;


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

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };
  const barGraph = new BarGraph(data, scene);

  // const dAxes = new DrawAxis({
  //   x: {
  //     from: 0,
  //     to: 20,
  //     step: 2,
  //     label: [
  //       { name: 'New York', color: 0xff0000 },
  //       { name: 'Moscow', color: 0x00ff00 },
  //       { name: 'London', color: 0x0000ff },
  //       { name: 'Paris', color: 0xffff00 },
  //       { name: 'Berlin', color: 0x00ffff },
  //       { name: 'Tokyo', color: 0xff00ff },
  //       { name: 'Beijing', color: 0x000000 },
  //       { name: 'Sydney', color: 0xdedede },
  //       { name: 'Cairo', color: 0x808080 },
  //       { name: 'Rio de Janeiro', color: 0x800000 }
  //     ],
  //     labelCenter: true,
  //   },
  //   y: {
  //     from: 0,
  //     to: 10,
  //     step: 2,
  //     label: 'numeric',
  //     lblColor: 0xd3d3d3
  //   },
    // z: {
    //   from: 0,
    //   to: 10,
    //   step: 2,
    //   label: [
    //     { name: 'New York', color: 0xff0000 },
    //     { name: 'Moscow', color: 0x00ff00 },
    //     { name: 'London', color: 0x0000ff },
    //     { name: 'Paris', color: 0xffff00 },
    //     { name: 'Berlin', color: 0x00ffff },
    //     { name: 'Tokyo', color: 0xff00ff },
    //     { name: 'Beijing', color: 0x000000 },
    //     { name: 'Sydney', color: 0xdedede },
    //     { name: 'Cairo', color: 0x808080 },
    //     { name: 'Rio de Janeiro', color: 0x800000 }
    //   ],
    //   lblColor: 0xd3d3d3,
    // }
  // }, true);
  // scene.add(dAxes);


  // const bar = new Bar({ width: 1.5, height: 10, depth: 0 }, { x: 1, y: 0, z: 0 }, 'rgba(255, 99, 132, 0.2)', true, 'rgb(255, 99, 132)', 1);
  // scene.add(bar);
  // const bar2 = new Bar({ width: 1.5, height: 10, depth: 0 }, { x: 3, y: 0, z: 0 }, 'rgba(255, 159, 64, 0.2)', true, 'rgb(255, 99, 132)', 1);
  // scene.add(bar2);
  // // scene.remove(bar.drawing);

  scene.background = new THREE.Color(0xffffff);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.render(scene, camera);

  // draw a sphere
  // const geometry = new THREE.SphereGeometry(1, 32, 32);
  // const material = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 150, flatShading: true });
  // const sphere = new THREE.Mesh(geometry, material);
  // sphere.position.set(5, 5, 0);
  // scene.add(sphere);

  // lights
  const light = new THREE.AmbientLight(0xffffff, 3);
  light.position.set(0, 5, 5);
  scene.add(light);
  function animate() {
    requestAnimationFrame(animate);
    // sphere.rotateY(0.01);
    // required if controls.enableDamping or controls.autoRotate are set to true
    // bar.rotate();
    // bar.scaleHeight();
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});