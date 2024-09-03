import { BufferGeometry, Color, ColorRepresentation, Group, LineBasicMaterial, Line as ThreeLine, Vector3 } from 'three';
import { colors } from './defaultColors';

export class LineGeometry extends BufferGeometry {
    constructor(
        private from: { x: number, y: number, z: number },
        private to: { x: number, y: number, z: number }
    ) {
        super();
        this.setFromPoints(
            [
                new Vector3(
                    this.from.x,
                    this.from.y,
                    this.from.z
                ),
                new Vector3(
                    this.to.x,
                    this.to.y,
                    this.to.z
                )
            ]
        );
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

export default class Line extends Group {
    private lineGeometry: LineGeometry;
    private lineMesh: LineMesh;

    constructor(
        private from: { x: number, y: number, z: number },
        private to: { x: number, y: number, z: number },
        private color: ColorRepresentation = colors.line,
        private material: LineBasicMaterial = new LineBasicMaterial()
    ) {
        super();
        this.material.color = new Color(this.color);
        this.lineGeometry = new LineGeometry(this.from, this.to);
        this.lineMesh = new LineMesh(this.lineGeometry, this.material);
        this.add(this.lineMesh);
    }
}