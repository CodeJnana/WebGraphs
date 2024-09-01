import * as THREE from 'three';

export type axis = {
    from: number;
    to: number;
    step?: number;
    color?: THREE.ColorRepresentation;
};
export type axes = {
    x?: axis,
    y?: axis,
    z?: axis
};