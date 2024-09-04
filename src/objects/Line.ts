import { BufferGeometry, Color, ColorRepresentation, LineBasicMaterial, Object3D, Line as ThreeLine, Vector3 } from 'three';
import { colors } from '../defaults';

export class LineGeometry extends BufferGeometry {
    constructor(...points: Vector3[]) {
        super();
        this.setFromPoints(points);
    }
}

export class LineMesh extends ThreeLine {
    constructor(lineGeometry: LineGeometry, material: LineBasicMaterial) {
        super(lineGeometry, material);
    }
}

export default class Line extends Object3D {
    private lineGeometry: LineGeometry;
    private lineMesh: LineMesh;

    constructor(
        private from: Vector3,
        private to: Vector3,
        private color: ColorRepresentation = new Color(colors.line),
        private material: LineBasicMaterial = new LineBasicMaterial()
    ) {
        super();
        this.material.color = new Color(this.color);
        this.lineGeometry = new LineGeometry(this.from, this.to);
        this.lineMesh = new LineMesh(this.lineGeometry, this.material);
        this.add(this.lineMesh);
    }
}