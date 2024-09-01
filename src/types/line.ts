import * as THREE from 'three';

export type line = {
    from: { x: number, y: number, z: number };
    to: { x: number, y: number, z: number };
    color: THREE.ColorRepresentation;
};