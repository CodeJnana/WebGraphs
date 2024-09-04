import { Box3, Color, ColorRepresentation, Object3D, Vector3 } from 'three';
import { colors } from '../defaults';
import Label from './Label';
import Line from './Line';

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

export class Axis extends Object3D {
    constructor(
        public name: 'x' | 'y' | 'z',
        from: number,
        to: number,
        color: ColorRepresentation = colors.axis
    ) {
        super();
        this.add(new Line(
            new Vector3(
                (name === 'x') ? from : 0,
                (name === 'y') ? from : 0,
                (name === 'z') ? from : 0
            ),
            new Vector3(
                (name === 'x') ? to : 0,
                (name === 'y') ? to : 0,
                (name === 'z') ? to : 0
            )
            , color)
        );
    }
}

export default class Graph extends Object3D {
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
        axisData && this.add(new Axis(
            axisName,
            axisData.from,
            axisData.to,
            axisData.color ?? colors.axis
        ));
    }

    drawStep(axisName: 'x' | 'y' | 'z'): Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData && axisData.step !== undefined) {
            for (let i = axisData.from; i <= axisData.to; i += axisData.step) {
                this.add(new Line(
                    new Vector3(
                        axisName === 'x' ? i : (axisName === 'y' ? 0.1 : 0),
                        axisName === 'y' ? i : (axisName === 'x' ? 0.1 : (axisName === 'z' ? 0.1 : 0)),
                        axisName === 'z' ? i : 0
                    ),
                    new Vector3(
                        axisName === 'x' ? i : (axisName === 'y' ? -0.1 : 0),
                        axisName === 'y' ? i : (axisName === 'x' ? -0.1 : (axisName === 'z' ? -0.1 : 0)),
                        axisName === 'z' ? i : 0
                    ),
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
                    const text = new Label(
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
                        this.add(new Line(
                            new Vector3(
                                (object.name === 'x') ? object.axisData.from : (axis.name === 'x' ? i : 0),
                                (object.name === 'y') ? object.axisData.from : (axis.name === 'y' ? i : 0),
                                (object.name === 'z') ? object.axisData.from : (axis.name === 'z' ? i : 0),
                            ),
                            new Vector3(
                                (object.name === 'x') ? object.axisData.to : (axis.name === 'x' ? i : 0),
                                (object.name === 'y') ? object.axisData.to : (axis.name === 'y' ? i : 0),
                                (object.name === 'z') ? object.axisData.to : (axis.name === 'z' ? i : 0),
                            ),
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
