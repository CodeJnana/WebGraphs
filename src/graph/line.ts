import * as THREE from 'three';
import Draw from '../interface/Draw';

export class DrawLine extends Draw {
    constructor(
        private from: { x: number, y: number, z: number },
        private to: { x: number, y: number, z: number },
        private color: THREE.ColorRepresentation
    ) {
        super();
    }

    build(): THREE.Object3D {
        const material = new THREE.LineBasicMaterial({ color: this.color });

        const geometry = new THREE.BufferGeometry().setFromPoints(
            [
                new THREE.Vector3(
                    this.from.x,
                    this.from.y,
                    this.from.z
                ),
                new THREE.Vector3(
                    this.to.x,
                    this.to.y,
                    this.to.z
                )
            ]
        );
        return new THREE.Line(geometry, material);
    }
}