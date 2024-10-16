import { BoxGeometry, Color, ColorRepresentation, EdgesGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, Vector3 } from 'three';
import { HoverActions } from '../effect/CustomAction';
import { Colors } from './colors/Color';
import { ax } from 'vitest/dist/chunks/reporters.DAfKSDh5.js';

type barType = '+y' | '-y' | '+x' | '-x' | '+z' | '-z';

export class BarGeometry extends BoxGeometry {
    constructor(private bar: {
        width: number;
        height: number;
        depth: number;
        barType?: barType;
    }) {
        super(bar.width, bar.height, bar.depth);
        switch (bar.barType) {
            case '+y':
                this.translate(0, this.bar.height / 2, 0);
                break;
            case '-y':
                this.translate(0, -this.bar.height / 2, 0);
                break;
            case '+x':
                this.rotateZ(Math.PI / 2);
                this.translate(this.bar.width, 0, 0);
                break;
            case '-x':
                this.rotateZ(Math.PI / 2);
                this.translate(-this.bar.width, 0, 0);
                break;
            default:
        }
    }
}

export class BarMesh extends Mesh implements HoverActions {
    constructor(
        barGeometry: BarGeometry,
        mesh: MeshBasicMaterial | MeshPhongMaterial,
        position: { x: number, y: number, z: number }
    ) {
        super(barGeometry, mesh);
        this.position.set(position.x, position.y, position.z);
    }

    hoverIn = () => {
        const material = this.material as MeshPhongMaterial;
        material.transparent = true;
        material.opacity = 0.2;
    }

    hoverOut = () => {
        const material = this.material as MeshPhongMaterial;
        material.transparent = false;
        material.opacity = 1;
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
            barType?: barType;
        },
        position: Vector3,
        private color: ColorRepresentation = Colors.bar,
        private borders: boolean = false,
        private borderColor: ColorRepresentation = Colors.barBorder,
        private borderThickness: number = 2,
        private barMaterial: MeshPhongMaterial | MeshBasicMaterial = new MeshPhongMaterial({ shininess: 150, transparent: true, opacity: 1 }),
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
        rotationSpeed: number = 0.01,
        clockwise: boolean = true
    ) {
        requestAnimationFrame(() => this.rotate(rotationSpeed, clockwise));
        let axis: 'x' | 'y' | 'z' | undefined;
        switch (this.dimensions.barType) {
            case '+y':
                axis = 'y';
                break;
            case '-y':
                axis = 'y';
                break;
            case '+x':
                axis = 'x';
                break;
            case '-x':
                axis = 'x';
                break;
            default:
        }
        if (axis === undefined) return;
        if (clockwise) {
            this.barBorderMesh.rotation[axis] += rotationSpeed;
            this.barMesh.rotation[axis] += rotationSpeed;
        } else {
            this.barBorderMesh.rotation[axis] -= rotationSpeed;
            this.barMesh.rotation[axis] = rotationSpeed;
        }
    }
}