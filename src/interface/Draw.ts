import * as THREE from 'three';

export default abstract class Draw {
    abstract build(): THREE.Object3D | Array<THREE.Object3D>;
}