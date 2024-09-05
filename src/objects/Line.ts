import { BufferGeometry, Color, ColorRepresentation, LineBasicMaterial, Object3D, Line as ThreeLine, Vector3 } from 'three';
import { Colors } from './colors/Color';

export interface LineInterface {
    from: Vector3;
    to: Vector3;
    color?: ColorRepresentation;
    material?: LineBasicMaterial;
}

export class LineGeometry extends BufferGeometry {
    constructor(...points: Vector3[]) {
        super();
        this.setFromPoints(points);
    }
}

export class LineMesh extends ThreeLine {
    constructor(
        lineGeometry: LineGeometry,
        material: LineBasicMaterial
    ) {
        super(lineGeometry, material);
    }
}

export default class Line extends Object3D {
    public lineGeometry: LineGeometry;
    private lineMesh: LineMesh;

    constructor({
        from,
        to,
        color = Colors.line,
        material = new LineBasicMaterial()
    }: LineInterface) {
        super();
        material.color = new Color(color);
        this.lineGeometry = new LineGeometry(from, to);
        this.lineMesh = new LineMesh(this.lineGeometry, material);
        this.add(this.lineMesh);
    }
}