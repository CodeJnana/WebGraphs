import { Box3, Color, ColorRepresentation, Object3D, Vector3 } from 'three';
import { Colors } from './colors/Color';
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
    axisLine?: AxisLine;
};
export type axes = {
    x?: axis,
    y?: axis,
    z?: axis
};

export class AxisLine extends Object3D {
    public stepPositions: Array<Vector3> = [];
    constructor(
        public name: 'x' | 'y' | 'z',
        public data: axis,
        public outlineColor: ColorRepresentation = Colors.plot
    ) {
        super();
        this.add(new Line({
            from: new Vector3(
                (name === 'x') ? this.data.from : 0,
                (name === 'y') ? this.data.from : 0,
                (name === 'z') ? this.data.from : 0
            ),
            to: new Vector3(
                (name === 'x') ? this.data.to : 0,
                (name === 'y') ? this.data.to : 0,
                (name === 'z') ? this.data.to : 0
            ),
            color: this.data.color ?? Colors.axis
        }));
        this.calculateStepPositions();
    }

    calculateStepPositions() {
        if (!this.data.step) return;
        if (this.data.step <= 0) return;
        for (let i = this.data.from; i <= this.data.to; i += this.data.step) {
            if (i === 0) continue;
            this.stepPositions.push(new Vector3(
                (this.name === 'x') ? i : 0,
                (this.name === 'y') ? i : 0,
                (this.name === 'z') ? i : 0
            ));
        }
    }

    drawParallelAxisOnStep(axes: axes) {
        (Object.keys(axes) as Array<'x' | 'y' | 'z'>).filter((name) => name !== this.name).forEach((name) => {
            this.stepPositions.forEach((point) => {
                if (axes[name]) {
                    const parallelPoints = this.getParallelAxisPoints(point, { name, point: axes[name] });
                    this.add(new Line({
                        from: parallelPoints.from,
                        to: parallelPoints.to,
                        color: this.outlineColor
                    }));
                }
            });
        });
    }

    getParallelAxisPoints(point: Vector3, axis: { name: string, point: axis }): { from: Vector3, to: Vector3 } {
        return {
            from: new Vector3(
                (axis.name === 'x') ? axis.point.from : (this.name === 'x' ? point.x : 0),
                (axis.name === 'y') ? axis.point.from : (this.name === 'y' ? point.y : 0),
                (axis.name === 'z') ? axis.point.from : (this.name === 'z' ? point.z : 0),
            ),
            to: new Vector3(
                (axis.name === 'x') ? axis.point.to : (this.name === 'x' ? point.x : 0),
                (axis.name === 'y') ? axis.point.to : (this.name === 'y' ? point.y : 0),
                (axis.name === 'z') ? axis.point.to : (this.name === 'z' ? point.z : 0),
            )
        }
    }

    drawLabels() {
        this.stepPositions.forEach((point, count) => {
            if (!this.data.label) return;
            const number = point[this.name];
            const label = this.data.label === 'numeric' ? number.toString() : (this.data.label[count]?.name ?? '');
            const color = new Color(this.data.label === 'numeric' ? (this.data.lblColor ?? Colors.text) : (this.data.label[count]?.color ?? Colors.text));
            let slitPoints = {
                from: new Vector3(0, 0, 0),
                to: new Vector3(0, 0, 0)
            };
            switch (this.name) {
                case 'x':
                    slitPoints = {
                        from: new Vector3(number, 0.1, 0),
                        to: new Vector3(number, -0.1, 0)
                    };
                    break;
                case 'y':
                    slitPoints = {
                        from: new Vector3(0.1, number, 0),
                        to: new Vector3(-0.1, number, 0)
                    };
                    break;
                case 'z':
                    slitPoints = {
                        from: new Vector3(0, 0.1, number),
                        to: new Vector3(0, -0.1, number)
                    };
                    break;
            }
            const slit = new Line({
                from: slitPoints['from'],
                to: slitPoints['to'],
                color: color
            });
            this.add(slit);
            const text = new Label(
                {
                    position: new Vector3(0, 0, 0),
                    text: label,
                    textSize: 0.15,
                    color: color,
                });
            const dimensions = new Box3().setFromObject(text).getSize(new Vector3());
            if (this.name === 'x') {
                if (number > 0) {
                    const xPosition = !this.data.labelCenter ? number - dimensions.x / 2 : count - number / 2 - dimensions.x / 2;
                    text.position.set(xPosition, -0.4, 0);
                } else {
                    const xPosition = !this.data.labelCenter ? (number - dimensions.x / 2) : count + number / 2 - dimensions.x / 2;
                    text.position.set(xPosition - 0.05, -0.4, 0);
                }
            }
            if (this.name === 'y') {
                text.position.set(-dimensions.x - 0.2, number - 0.1, 0);
            }
            if (this.name === 'z') {
                if (number > 0)
                    text.position.set(0, -0.5, number + dimensions.x / 2);
                else
                    text.position.set(0, -0.5, number + (dimensions.x / 2) + 0.05);
                text.rotateY(Math.PI / 2);
            }
            this.add(text);
        });
    }
}

type GraphProps = {
    axes: axes,
    outline2D?: boolean,
    outline2DColor?: ColorRepresentation,
    outline3D?: boolean,
    outline3DColor?: ColorRepresentation
};

export default class Graph extends Object3D {
    private axes: axes;
    private outline2D: boolean;
    private outline2DColor: ColorRepresentation;
    private outline3D: boolean;
    private outline3DColor: ColorRepresentation;

    constructor({
        axes,
        outline2D = false,
        outline2DColor = Colors.plot,
        outline3D = false,
        outline3DColor = Colors.plot
    }: GraphProps) {
        super();
        this.axes = axes;
        this.outline2D = outline2D;
        this.outline2DColor = outline2DColor;
        this.outline3D = outline3D;
        this.outline3DColor = outline3DColor;

        if (Object.keys(axes).length === 0) {
            throw new Error('At least one axis is required');
        }
        this.drawAxis();
        this.outline3D && this.drawAxisOnIntersection();
    }

    drawAxis(): void {
        for (const axis of Object.keys(this.axes) as Array<'x' | 'y' | 'z'>) {
            const axisData = this.axes[axis];
            if (axisData) {
                const axisLine = new AxisLine(
                    axis,
                    axisData,
                    this.outline2D ? this.outline2DColor : this.outline3DColor
                );
                this.add(axisLine);
                axisData['axisLine'] = axisLine;
                (this.outline2D || this.outline3D) && axisLine.drawParallelAxisOnStep(this.axes);
                axisLine.drawLabels();
            }
        }
    }

    drawAxisOnIntersection(): void {
        if (Object.keys(this.axes).length < 3) return;
        this.getAllLinesDrawn('x', { axis2: 'y', axis3: 'z' });
        this.getAllLinesDrawn('y', { axis2: 'x', axis3: 'z' });
        this.getAllLinesDrawn('z', { axis2: 'x', axis3: 'y' });
    }

    getAllLinesDrawn(axis1: 'x' | 'y' | 'z', axes: {
        axis2: 'x' | 'y' | 'z',
        axis3: 'x' | 'y' | 'z'
    }) {
        const intersectingPoints = this.getIntersectionPoint(axes.axis2, axes.axis3);
        intersectingPoints.forEach((point) => {
            if (!this.axes[axis1]) return;
            const intersectionLinePoint = this.calculateIntersectionLinePoints(point, { name: axis1, point: this.axes[axis1] });
            const intersectionLine = new Line({
                from: intersectionLinePoint.from,
                to: intersectionLinePoint.to,
                color: this.outline3DColor
            });
            this.add(intersectionLine);
        });
    }

    calculateIntersectionLinePoints(point: Vector3, axis: {
        name: 'x' | 'y' | 'z',
        point: axis
    }): { from: Vector3, to: Vector3 } {
        return {
            from: new Vector3(
                (axis.name === 'x') ? axis.point.from : point.x,
                (axis.name === 'y') ? axis.point.from : point.y,
                (axis.name === 'z') ? axis.point.from : point.z
            ),
            to: new Vector3(
                (axis.name === 'x') ? axis.point.to : point.x,
                (axis.name === 'y') ? axis.point.to : point.y,
                (axis.name === 'z') ? axis.point.to : point.z
            )
        }
    }

    getIntersectionPoint(axisName1: 'x' | 'y' | 'z', axisName2: 'x' | 'y' | 'z'): Array<Vector3> {
        const axis1 = this.axes[axisName1]?.axisLine;
        const axis2 = this.axes[axisName2]?.axisLine;
        const points: Array<Vector3> = [];
        if (!axis1 || !axis2) return points;
        axis1.stepPositions.forEach((point1) => {
            axis2.stepPositions.forEach((point2) => {
                const calcPoint = new Vector3(
                    axis1.name === 'x' ? point1.x : (axis2.name === 'x' ? point2.x : 0),
                    axis1.name === 'y' ? point1.y : (axis2.name === 'y' ? point2.y : 0),
                    axis1.name === 'z' ? point1.z : (axis2.name === 'z' ? point2.z : 0),
                );
                points.push(calcPoint);
            });
        });
        return points;
    }
}
