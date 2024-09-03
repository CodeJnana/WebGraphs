import { Box3, Color, ColorRepresentation, Group, Object3D, Vector3 } from 'three';
import { colors } from './defaultColors';
import DrawLabel from '../objects/label';
import { default as DrawLine, default as Line } from './line';

export type axis = {
    from: number;
    to: number;
    step?: number;
    color?: ColorRepresentation;
    label?: 'numeric' | Array<{ name: string, color: ColorRepresentation }>;
    labelCenter?: boolean;
    lblColor?: ColorRepresentation;
};
export type axes = {
    x?: axis,
    y?: axis,
    z?: axis
};
export default class Axis extends Group {
    constructor(
        private axes: axes,
        private outline: boolean = false
    ) {
        super();
        for (const axis of Object.keys(this.axes) as Array<'x' | 'y' | 'z'>) {
            if (this.outline) {
                this.calculateOutlines(this.axes);
            }
            this.drawAxis(axis);
            this.drawStep(axis);
            this.drawLabel(axis);
        }
    }

    drawAxis(axisName: 'x' | 'y' | 'z'): Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData) {
            this.add(
                new Line(
                    {
                        x: (axisName === 'x') ? axisData.from - 0.25 : 0,
                        y: (axisName === 'y') ? axisData.from - 0.25 : 0,
                        z: (axisName === 'z') ? axisData.from - 0.25 : 0
                    },
                    {
                        x: (axisName === 'x') ? axisData.to + 0.25 : 0,
                        y: (axisName === 'y') ? axisData.to + 0.25 : 0,
                        z: (axisName === 'z') ? axisData.to + 0.25 : 0
                    },
                    axisData.color ?? colors.axis
                )
            );
        }
    }

    drawStep(axisName: 'x' | 'y' | 'z'): Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData && axisData.step !== undefined) {
            for (let i = axisData.from; i <= axisData.to; i += axisData.step) {
                this.add(new DrawLine(
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
                ));
            }
        }
    }

    drawLabel(axisName: 'x' | 'y' | 'z'): Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData.label && axisData.step) {
            let lblCount = 0;
            for (let i = axisData.from; i <= axisData.to; i += axisData.step) {
                if (i !== 0) {
                    const color = new Color(axisData.label === 'numeric' ? (axisData.lblColor ?? colors.text) : (axisData.label[lblCount]?.color ?? colors.text));
                    let label = axisData.label === 'numeric' ? i.toString() : (axisData.label[lblCount]?.name ?? '');
                    const text = new DrawLabel(
                        new Vector3(0, 0, 0),
                        label,
                        0.15,
                        color,
                    );

                    const dimensions = new Box3().setFromObject(text).getSize(new Vector3());
                    if (axisName === 'x') {
                        if (i > 0) {
                            const xPosition = !axisData.labelCenter ? i - dimensions.x / 2 : i - axisData.step / 2 - dimensions.x / 2;
                            text.position.set(xPosition, -0.4, 0);
                        } else {
                            const xPosition = !axisData.labelCenter ? (i - dimensions.x / 2) : i + axisData.step / 2 - dimensions.x / 2;
                            text.position.set(xPosition - 0.05, -0.4, 0);
                        }
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
                    this.add(text);
                    lblCount++;
                }
            }
        }
    }

    drawOutline(
        axis: {
            name: string,
            axisData: axis
        },
        axes: Array<{
            name: string,
            axisData: axis
        }>): Object3D | void {
        if (axis.axisData.step) {
            for (let i = axis.axisData.from; i <= axis.axisData.to; i += axis.axisData.step) {
                axes.forEach((object) => {
                    if (i !== 0) {
                        this.add(new DrawLine(
                            {
                                x: (object.name === 'x') ? object.axisData.from : (axis.name === 'x' ? i : 0),
                                y: (object.name === 'y') ? object.axisData.from : (axis.name === 'y' ? i : 0),
                                z: (object.name === 'z') ? object.axisData.from : (axis.name === 'z' ? i : 0),
                            },
                            {
                                x: (object.name === 'x') ? object.axisData.to : (axis.name === 'x' ? i : 0),
                                y: (object.name === 'y') ? object.axisData.to : (axis.name === 'y' ? i : 0),
                                z: (object.name === 'z') ? object.axisData.to : (axis.name === 'z' ? i : 0),
                            },
                            object.axisData.color ?? colors.plot
                        ));
                    }
                });
            }
        }
    }

    calculateOutlines(axis: axes): Object3D | void {
        const axisNames = Object.keys(axis) as Array<'x' | 'y' | 'z'>;
        for (const axisName of axisNames) {
            const axisData = axis[axisName] as axis;
            if (axisData && axisData.step) {
                const axes = axisNames.map((name) => {
                    if (name !== axisName) {
                        return {
                            name,
                            axisData: axis[name] as axis
                        };
                    }
                }).filter((axis) => axis !== undefined);
                const outline = this.drawOutline({ name: axisName, axisData }, axes as any);
                if (outline)
                    this.add(outline);
            }
        }
    }
}
