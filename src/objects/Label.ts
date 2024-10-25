import { Box3, Color, ColorRepresentation, Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector3 } from 'three';
import { Font, TextGeometry } from "three/examples/jsm/Addons.js";
import helvetiker_regular from '../fonts/helvetiker_regular.typeface.json';
import { Colors } from './colors/Color';
import WebGraphsObject3D from './WebGraphsObject3D';


export interface LabelInterface {
    text: string;
    position: Vector3;
    textSize?: number;
    color?: ColorRepresentation;
    material?: MeshBasicMaterial | MeshPhongMaterial;
}


export type ShiftType = {
    type: 'x' | 'y' | 'z',
    distance: number
}

export class LabelGeometry extends TextGeometry {
    constructor(
        public text: string,
        size: number,
        depth = 0.01,
        height = 0.1,
        curveSegments = 12,
    ) {
        super(text, {
            font: new Font(helvetiker_regular),
            size: size,
            depth,
            height,
            curveSegments,
        });
        this.center();
    }
}

export class LabelMesh extends Mesh {
    constructor(
        geometry: LabelGeometry,
        material: MeshBasicMaterial | MeshPhongMaterial,
        position: Vector3
    ) {
        super(geometry, material);
        this.position.set(position.x, position.y, position.z);
    }
}

export default class Label extends WebGraphsObject3D {
    public geometry: LabelGeometry;
    public mesh: LabelMesh;

    constructor({
        text,
        position,
        textSize = 0.15,
        color = Colors.text,
        material = new MeshBasicMaterial()
    }: LabelInterface) {
        super();
        material.color = new Color(color);
        this.geometry = new LabelGeometry(text, textSize);
        this.mesh = new LabelMesh(this.geometry, material, position);
        this.add(this.mesh);
    }

    setPosition(
        position: Vector3,
        shiftPosition?: ShiftType | ShiftType[]
    ) {
        const dimensions = new Box3().setFromObject(this).getSize(new Vector3());
        if (!shiftPosition) {
            this.position.set(position.x, position.y, position.z);
            return;
        }

        const shifts = !Array.isArray(shiftPosition) ? [shiftPosition] : shiftPosition;

        shifts.forEach(shift => {
            switch (shift.type) {
                case 'x':
                    const x = shift.distance > 0 ? position.x + shift.distance + dimensions.x / 2 : position.x + shift.distance - dimensions.x / 2;
                    this.position.set(x, position.y, position.z);
                    break;
                case 'y':
                    const y = shift.distance < 0 ? position.y + shift.distance - dimensions.y / 2 : position.y + shift.distance + dimensions.y / 2;
                    this.position.set(position.x, y, position.z);
                    break;
                case 'z':
                    const z = shift.distance > 0 ? position.z + shift.distance + dimensions.z / 2 : position.z + shift.distance - dimensions.z / 2;
                    this.position.set(position.x, position.y, z);
                    break;
            }
            position = this.position; // reset position so next time it moves by the next shift
        });
    }
}