import { BoxGeometry, Color, ColorRepresentation, EdgesGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, Vector3 } from 'three';
import { Colors } from './colors/Color';

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

export default class Bar extends Object3D {
    private barGeometry: BarGeometry;
    public barMesh: BarMesh;
    private barBorderMesh: LineSegments = new LineSegments();

    private growthHeight: number = 0;

    constructor(
        private dimensions: {
            width: number;
            height: number;
            depth: number;
        },
        position: Vector3,
        private color: ColorRepresentation = Colors.bar,
        private borders: boolean = false,
        private borderColor: ColorRepresentation = Colors.barBorder,
        private borderThickness: number = 2,
        private barMaterial: MeshPhongMaterial | MeshBasicMaterial = new MeshPhongMaterial({ shininess: 150, transparent: true, opacity: 0.2 }),
    ) {
        super();
        this.barMaterial.color = new Color(this.color);
        this.barGeometry = new BarGeometry(this.dimensions);
        this.barMesh = new BarMesh(this.barGeometry, this.barMaterial, position);

        const objects: Object3D[] = [];
        this.borders && objects.push(this.drawBorder());
        objects.push(this.barMesh);
        this.add(...objects);
    }

    drawBorder(): LineSegments {
        const geometry = new EdgesGeometry(this.barGeometry);
        const material = new LineBasicMaterial({ color: this.borderColor, linewidth: this.borderThickness });
        this.barBorderMesh.geometry = geometry;
        this.barBorderMesh.material = material;
        this.barBorderMesh.position.set(this.barMesh.position.x, this.barMesh.position.y, this.barMesh.position.z);
        return this.barBorderMesh;
    }

    rotate(
        axis: 'x' | 'y' | 'z' = 'y',
        rotationSpeed: number = 0.01,
        clockwise: boolean = true
    ) {
        if (clockwise) {
            this.barBorderMesh.rotation[axis] += rotationSpeed;
            this.barMesh.rotation[axis] += rotationSpeed;
        } else {
            this.barBorderMesh.rotation[axis] -= rotationSpeed;
            this.barMesh.rotation[axis] = rotationSpeed;
        }
    }

    scaleHeight(speed: number = this.dimensions.height / 10): boolean {
        if (this.growthHeight < this.dimensions.height) {
            this.barMesh.geometry = new BarGeometry({ width: this.dimensions.width, height: this.growthHeight, depth: this.dimensions.depth });
            this.growthHeight += speed;
            if (this.growthHeight > this.dimensions.height) {
                this.growthHeight = this.dimensions.height;
            }
            const geometry = new EdgesGeometry(this.barMesh.geometry);
            this.barBorderMesh.geometry = geometry;
            return false;
        }
        return true;
    }
}