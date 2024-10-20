import { BufferGeometry, Color, ColorRepresentation, LineBasicMaterial, Object3D, Line as ThreeLine, Vector3 } from 'three';
import { Colors } from './colors/Color';

export interface LineInterface {
    from: Vector3;
    to: Vector3;
    color?: ColorRepresentation;
    material?: LineBasicMaterial;
}

export class geometry extends BufferGeometry {
    constructor(...points: Vector3[]) {
        super();
        this.setFromPoints(points);
    }
}

export class LineMesh extends ThreeLine {
    constructor(
        geometry: geometry,
        material: LineBasicMaterial
    ) {
        super(geometry, material);
    }
}

export default class Line extends Object3D {
    public geometry: geometry;
    public mesh: LineMesh;

    constructor({
        from,
        to,
        color = Colors.line,
        material = new LineBasicMaterial()
    }: LineInterface) {
        super();
        material.color = new Color(color);
        this.geometry = new geometry(from, to);
        this.mesh = new LineMesh(this.geometry, material);
        this.add(this.mesh);
    }
}