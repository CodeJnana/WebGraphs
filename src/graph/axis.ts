import * as THREE from 'three';
import { DrawLine } from './line';
import { axes, axis } from '../types/axes';
import { colors } from './defaultColors';
import Draw from '../interface/Draw';
import DrawText from './text';

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

            const drawLabel = this.drawLabel(axisObj as 'x' | 'y' | 'z');
            if (drawLabel) {
                objects.push(drawLabel);
            }
        }
        return new THREE.Group().add(...objects);
    }

    drawAxis(axisName: 'x' | 'y' | 'z'): THREE.Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData) {
            return new DrawLine(
                {
                    x: (axisName === 'x') ? axisData.from - 0.5 : 0,
                    y: (axisName === 'y') ? axisData.from - 0.5 : 0,
                    z: (axisName === 'z') ? axisData.from - 0.5 : 0
                },
                {
                    x: (axisName === 'x') ? axisData.to + 0.5 : 0,
                    y: (axisName === 'y') ? axisData.to + 0.5 : 0,
                    z: (axisName === 'z') ? axisData.to + 0.5 : 0
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

    drawLabel(axisName: 'x' | 'y' | 'z'): THREE.Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData.label && axisData.step) {
            const objects: THREE.Object3D[] = [];
            let lblCount = 0;
            for (let i = axisData.from; i <= axisData.to; i += axisData.step) {
                if (i !== 0) {
                    const text = new DrawText(
                        { x: 0, y: 0, z: 0 },
                        axisData.label === 'numeric' ? i.toString() : (axisData.label[lblCount]?.name ?? ''),
                        axisData.label === 'numeric' ? (axisData.lblColor ?? colors.text) : (axisData.label[lblCount]?.color ?? colors.text),
                    ).build();

                    const dimensions = new THREE.Box3().setFromObject(text).getSize(new THREE.Vector3());
                    if (axisName === 'x') {
                        if (i > 0)
                            text.position.set(i - dimensions.x / 2, -0.5, 0);
                        else
                            text.position.set(i - dimensions.x / 2 - 0.05, -0.5, 0);
                    }
                    if (axisName === 'y') {
                        text.position.set(-dimensions.x - 0.2, i - 0.1, 0);
                    }
                    if (axisName === 'z') {
                        if (i > 0)
                            text.position.set(0, -0.5, i + dimensions.x / 2);
                        else
                            text.position.set(0, -0.5, i + (dimensions.x / 2) + 0.05);
                        text.rotateY(Math.PI / 2);
                    }
                    objects.push(text);
                    lblCount++;
                }
            }
            return new THREE.Group().add(...objects);
        }
    }
}
