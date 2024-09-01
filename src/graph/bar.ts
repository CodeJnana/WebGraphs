import * as THREE from 'three';
import { colors } from './defaultColors';

type bar = {
    width: number;
    height: number;
    depth: number;
    color?: THREE.ColorRepresentation;
    position: { x: number, y: number, z: number };
    animate?: boolean;
};

let barHeight = 0;
let positionY = 0;

export function drawBar(bar: bar, scene: THREE.Scene): () => void {
    const geometry = new THREE.BoxGeometry(bar.width, barHeight, bar.depth);
    const material = new THREE.MeshPhongMaterial({
        color: bar.color ?? colors.bar, shininess: 150, flatShading: true,
        opacity: 0.5, transparent: true
    });
    let barMesh = new THREE.Mesh(geometry, material);
    barMesh.position.set(bar.position.x, bar.position.y, bar.position.z);
    scene.add(barMesh);
    return () => {
        if (!bar.animate) {
            barMesh.geometry.dispose();
            barMesh.geometry = new THREE.BoxGeometry(bar.width, bar.height, bar.depth);
            if (barMesh.rotation.y === 0) {
                barMesh.rotateY(Math.PI / 4);
            }
            return;
        }
        if (barHeight <= bar.height) {
            barHeight += 0.1;
            barMesh.geometry.dispose();
            barMesh.geometry = new THREE.BoxGeometry(bar.width, barHeight, bar.depth);
        }
        if (positionY < bar.position.y) {
            positionY += 0.1 / 2;
            barMesh.position.set(bar.position.x, positionY, bar.position.z);
        }
        barMesh.rotateY(0.01);
    };
}