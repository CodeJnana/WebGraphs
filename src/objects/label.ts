import { Color, ColorRepresentation, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, Vector3 } from 'three';
import { Font, TextGeometry } from "three/examples/jsm/Addons.js";
import helvetiker_regular from '../fonts/helvetiker_regular.typeface.json';
import { Colors } from './colors/Color';


export interface LabelInterface {
    text: string;
    position: Vector3;
    textSize?: number;
    color?: ColorRepresentation;
    material?: MeshBasicMaterial | MeshPhongMaterial;
}

export class LabelGeometry extends TextGeometry {
    constructor(
        public text: string,
        size: number,
        depth = 0.01,
        height = 0.1,
        curveSegments = 12,
    ) {
        super(text, {
            font: new Font(helvetiker_regular),
            size: size,
            depth,
            height,
            curveSegments,
        });
    }
}

export class LabelMesh extends Mesh {
    constructor(
        lblGeometry: LabelGeometry,
        material: MeshBasicMaterial | MeshPhongMaterial,
        position: Vector3
    ) {
        super(lblGeometry, material);
        this.position.set(position.x, position.y, position.z);
    }
}

export default class Label extends Object3D {
    public lblGeometry: LabelGeometry;
    public lblMesh: LabelMesh;

    constructor({
        text,
        position,
        textSize = 0.15,
        color = Colors.text,
        material = new MeshPhongMaterial()
    }: LabelInterface) {
        super();
        material.color = new Color(color);
        this.lblGeometry = new LabelGeometry(text, textSize);
        this.lblMesh = new LabelMesh(this.lblGeometry, material, position);
        this.add(this.lblMesh);
    }
}