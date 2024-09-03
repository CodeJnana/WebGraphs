import { BoxGeometry, Color, ColorRepresentation, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D } from 'three';
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
        mesh: MeshBasicMaterial | MeshPhongMaterial,
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
    private barBorderMesh: LineSegments = new LineSegments();

    private growthHeight: number = 0;

    constructor(
        private dimensions: {
            width: number;
            height: number;
            depth: number;
        },
        private position: { x: number, y: number, z: number },
        private color: ColorRepresentation = colors.bar,
        private barMaterial: MeshPhongMaterial | MeshBasicMaterial = new MeshPhongMaterial({ shininess: 150 })
    ) {
        super();
        this.barMaterial.color = new Color(this.color);
        this.barGeometry = new BarGeometry(this.dimensions);
        this.barMesh = new BarMesh(this.barGeometry, this.barMaterial, this.position);
    }

    render(borders: boolean = false): Object3D {
        const objects: Object3D[] = [];
        if (borders) {
            objects.push(this.border());
        }
        objects.push(this.barMesh);
        return new Group().add(...objects);
    }

    border() {
        const geometry = new EdgesGeometry(this.barGeometry);
        const material = new LineBasicMaterial({ color: 0x00000, linewidth: 2 });
        this.barBorderMesh.geometry = geometry;
        this.barBorderMesh.material = material;
        this.barBorderMesh.position.set(this.position.x, this.position.y, this.position.z);
        return this.barBorderMesh;
    }

    rotateY(clockwise: boolean = true) {
        if (clockwise) {
            this.barBorderMesh.rotation.y += 0.01;
            this.barMesh.rotation.y += 0.01;
        } else {
            this.barBorderMesh.rotation.y -= 0.01;
            this.barMesh.rotation.y -= 0.01;
        }
    }

    scaleHeight(): boolean {
        if (this.growthHeight < this.dimensions.height) {
            this.barMesh.geometry = new BarGeometry({ width: this.dimensions.width, height: this.growthHeight, depth: this.dimensions.depth });
            this.growthHeight += this.dimensions.height / 100;
            const geometry = new EdgesGeometry(this.barMesh.geometry);
            this.barBorderMesh.geometry = geometry;
            return false;
        }
        return true;
    }
}