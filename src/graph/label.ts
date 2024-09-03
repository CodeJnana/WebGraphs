import { Color, ColorRepresentation, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial } from 'three';
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { colors } from './defaultColors';

declare const window: any;

export type textPosition = {
    x: number,
    y: number,
    z: number
}

export class LabelGeometry extends TextGeometry {
    constructor(text: string, size = 0.15) {
        super(text, {
            font: window.graph.font,
            size: size,
            depth: 0.01,
            height: 0.1,
            curveSegments: 12,
        });
    }
}

export class LabelMesh extends Mesh {
    constructor(
        lblGeometry: LabelGeometry,
        material: MeshBasicMaterial | MeshPhongMaterial,
        position: textPosition
    ) {
        super(lblGeometry, material);
        this.position.set(position.x, position.y, position.z);
    }
}

export default class Label extends Group {
    private lblGeometry: LabelGeometry;
    private lblMesh: LabelMesh;

    constructor(
        private labelPosition: textPosition,
        private text: string,
        private textSize: number = 0.15,
        private color: ColorRepresentation = colors.text,
        private material: MeshBasicMaterial | MeshPhongMaterial = new MeshBasicMaterial(),
    ) {
        super();
        this.material.color = new Color(this.color);
        this.lblGeometry = new LabelGeometry(this.text, this.textSize);
        this.lblMesh = new LabelMesh(this.lblGeometry, this.material, this.position);
        this.lblMesh.position.set(
            this.labelPosition.x,
            this.labelPosition.y,
            this.labelPosition.z
        );
        this.add(this.lblMesh);
    }
}