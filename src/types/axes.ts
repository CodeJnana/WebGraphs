import * as THREE from 'three';

export type axis = {
    from: number;
    to: number;
    step?: number;
    color?: THREE.ColorRepresentation;
    label?: 'numeric' | Array<{ name: string, color: THREE.ColorRepresentation }>;
    lblColor?: THREE.ColorRepresentation;
};
export type axes = {
    x?: axis,
    y?: axis,
    z?: axis
};