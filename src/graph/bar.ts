import { BoxGeometry, Color, ColorRepresentation, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D } from 'three';
import Draw from '../interface/Draw';
import { colors } from './defaultColors';

export class BarGeometry extends BoxGeometry {
    constructor(private bar: {
        width: number;
        height: number;
        depth: number;
    }) {
        super(bar.width, bar.height, bar.depth);
        this.translate(0, this.bar.height / 2, 0); // should always start drawing from bottom center
        return this;
    }
}

export class BarMesh extends Mesh {
    constructor(
        barGeometry: BarGeometry,
        mesh: Material,
        position: { x: number, y: number, z: number }
    ) {
        super(barGeometry, mesh);
        this.position.set(position.x, position.y, position.z);
        return this;
    }
}

export default class DrawBar extends Draw {
    private barGeometry: BarGeometry;
    private barMesh: BarMesh;

    constructor(
        private dimensions: {
            width: number;
            height: number;
            depth: number;
        },
        private position: { x: number, y: number, z: number },
        private color: ColorRepresentation = colors.bar,
        private barMaterial?: MeshPhongMaterial | MeshBasicMaterial
    ) {
        super();
        if (!this.barMaterial) {
            this.barMaterial = new MeshPhongMaterial({ color: new Color(this.color), shininess: 150 });
        }
        this.barGeometry = new BarGeometry(this.dimensions);
        this.barMesh = new BarMesh(this.barGeometry, this.barMaterial, this.position);
    }

    render(borders: boolean = false): Object3D {
        const objects: Object3D[] = [];
        if (borders) {
            objects.push(this.generateBorder());
        }
        objects.push(this.barMesh);
        return new Group().add(...objects);
    }

    generateBorder() {
        var geometry = new EdgesGeometry(this.barGeometry);

        var material = new LineBasicMaterial({ color: 0x00000, linewidth: 2 });

        const edges = new LineSegments(
            geometry,
            material,
        );
        edges.position.set(this.position.x, this.position.y, this.position.z);
        return edges;
    }
}