import * as THREE from 'three';
import { DrawLine } from './line';
import { axes, axis } from '../types/axes';
import { colors } from './defaultColors';
import Draw from '../interface/Draw';

export default class DrawAxis extends Draw {

    constructor(private axes: axes) {
        super();
    }

    build() {
        const objects: THREE.Object3D[] = [];
        for (const axisObj of Object.keys(this.axes)) {
            const drawAxis = this.drawAxis(axisObj as 'x' | 'y' | 'z');
            if (drawAxis) {
                objects.push(drawAxis);
            }

            const drawStep = this.drawStep(axisObj as 'x' | 'y' | 'z');
            if (drawStep) {
                objects.push(drawStep);
            }
        }
        return new THREE.Group().add(...objects);
    }

    drawAxis(axisName: 'x' | 'y' | 'z'): THREE.Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData) {
            return new DrawLine(
                {
                    x: (axisName === 'x') ? axisData.from : 0,
                    y: (axisName === 'y') ? axisData.from : 0,
                    z: (axisName === 'z') ? axisData.from : 0
                },
                {
                    x: (axisName === 'x') ? axisData.to : 0,
                    y: (axisName === 'y') ? axisData.to : 0,
                    z: (axisName === 'z') ? axisData.to : 0
                },
                axisData.color ?? colors.axis
            ).build();
        }
    }

    drawStep(axisName: 'x' | 'y' | 'z'): THREE.Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData && axisData.step !== undefined) {
            const objects: THREE.Object3D[] = [];
            for (let i = axisData.from; i <= axisData.to; i += axisData.step) {
                objects.push(new DrawLine(
                    {
                        x: axisName === 'x' ? i : (axisName === 'y' ? 0.1 : 0),
                        y: axisName === 'y' ? i : (axisName === 'x' ? 0.1 : (axisName === 'z' ? 0.1 : 0)),
                        z: axisName === 'z' ? i : 0
                    },
                    {
                        x: axisName === 'x' ? i : (axisName === 'y' ? -0.1 : 0),
                        y: axisName === 'y' ? i : (axisName === 'x' ? -0.1 : (axisName === 'z' ? -0.1 : 0)),
                        z: axisName === 'z' ? i : 0
                    },
                    axisData.color ?? colors.axis
                ).build());
            }
            return new THREE.Group().add(...objects);
        }
    }
}
