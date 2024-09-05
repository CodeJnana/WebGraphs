import { Box3, Color, ColorRepresentation, Object3D, Vector3 } from 'three';
import Label from './Label';
import Line from './Line';
import { Colors } from './colors/Color';

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
        public from: number,
        public to: number,
        public color: ColorRepresentation = Colors.axis
    ) {
        super();
        this.add(new Line({
            from: new Vector3(
                (name === 'x') ? this.from : 0,
                (name === 'y') ? this.from : 0,
                (name === 'z') ? this.from : 0
            ),
            to: new Vector3(
                (name === 'x') ? this.to : 0,
                (name === 'y') ? this.to : 0,
                (name === 'z') ? this.to : 0
            ),
            color
        })
        );
    }
}

export class ParallelAxis extends Object3D {
    constructor(
        axis: Axis,
        point: Vector3,
        color: ColorRepresentation = Colors.plot
    ) {
        super();
        this.add(new Line({
            from: new Vector3(
                (axis.name === 'x') ? axis.from : point.x,
                (axis.name === 'y') ? axis.from : point.y,
                (axis.name === 'z') ? axis.from : point.z
            ),
            to: new Vector3(
                (axis.name === 'x') ? axis.to : point.x,
                (axis.name === 'y') ? axis.to : point.y,
                (axis.name === 'z') ? axis.to : point.z
            ),
            color
        }));
    }
}

export default class Graph extends Object3D {
    private groupAxes: Axis[] = [];
    
    constructor(
        private axes: axes,
        private outline: boolean = false
    ) {
        super();
        for (const axis of Object.keys(this.axes) as Array<'x' | 'y' | 'z'>) {
            if (this.outline) {
                this.calculateOutlines(this.axes);
            }
            this.drawStep(axis);
            this.drawLabel(axis);
        }

        this.drawAxis();
    }

    drawAxis(): void {
        this.groupAxes = [];
        for (const axis of Object.keys(this.axes) as Array<'x' | 'y' | 'z'>) {
            const axisData = this.axes[axis] as axis;
            axisData && this.groupAxes.push(new Axis(axis, axisData.from, axisData.to, axisData.color));
        }
        this.add(...this.groupAxes);
    }

    drawStep(axisName: 'x' | 'y' | 'z'): Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData && axisData.step !== undefined) {
            for (let i = axisData.from; i <= axisData.to; i += axisData.step) {
                this.add(new Line({
                    from: new Vector3(
                        axisName === 'x' ? i : (axisName === 'y' ? 0.1 : 0),
                        axisName === 'y' ? i : (axisName === 'x' ? 0.1 : (axisName === 'z' ? 0.1 : 0)),
                        axisName === 'z' ? i : 0
                    ),
                    to: new Vector3(
                        axisName === 'x' ? i : (axisName === 'y' ? -0.1 : 0),
                        axisName === 'y' ? i : (axisName === 'x' ? -0.1 : (axisName === 'z' ? -0.1 : 0)),
                        axisName === 'z' ? i : 0
                    ),
                    color: axisData.color ?? Colors.axis
                }));
            }
        }
    }

    drawLabel(axisName: 'x' | 'y' | 'z'): Object3D | void {
        const axisData = this.axes[axisName] as axis;
        if (axisData.label && axisData.step) {
            let lblCount = 0;
            for (let i = axisData.from; i <= axisData.to; i += axisData.step) {
                if (i !== 0) {
                    const color = new Color(axisData.label === 'numeric' ? (axisData.lblColor ?? Colors.text) : (axisData.label[lblCount]?.color ?? Colors.text));
                    let label = axisData.label === 'numeric' ? i.toString() : (axisData.label[lblCount]?.name ?? '');
                    const text = new Label(
                        {
                            position: new Vector3(0, 0, 0),
                            text: label,
                            textSize: 0.15,
                            color: color,
                        }
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
                        this.add(new Line({
                            from: new Vector3(
                                (object.name === 'x') ? object.axisData.from : (axis.name === 'x' ? i : 0),
                                (object.name === 'y') ? object.axisData.from : (axis.name === 'y' ? i : 0),
                                (object.name === 'z') ? object.axisData.from : (axis.name === 'z' ? i : 0),
                            ),
                            to: new Vector3(
                                (object.name === 'x') ? object.axisData.to : (axis.name === 'x' ? i : 0),
                                (object.name === 'y') ? object.axisData.to : (axis.name === 'y' ? i : 0),
                                (object.name === 'z') ? object.axisData.to : (axis.name === 'z' ? i : 0),
                            ),
                            color: object.axisData.color ?? Colors.plot
                        }));
                    }
                });
            }
        }
    }

    calculateOutlines(axis: axes): void {
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
