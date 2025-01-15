import { BufferGeometry, Color, ColorRepresentation, LineBasicMaterial, Line as ThreeLine, Vector3 } from 'three';
import { Colors } from './colors/Color';
import WebGraphsObject3D from './WebGraphsObject3D';

export interface LineInterface {
    from: Vector3;
    to: Vector3;
    color?: ColorRepresentation;
    material?: LineBasicMaterial;
}

export default class Line extends WebGraphsObject3D {
    public geometry: BufferGeometry;
    public mesh: ThreeLine;

    constructor({
        from,
        to,
        color = Colors.line,
        material = new LineBasicMaterial()
    }: LineInterface) {
        super();
        material.color = new Color(color);
        this.geometry = new BufferGeometry().setFromPoints([from, to]);
        this.mesh = new ThreeLine(this.geometry, material);
        this.add(this.mesh);
    }
}