import { Box3, Color, ColorRepresentation, Object3D, Vector3 } from 'three';
import Line from './Line';
import { Colors } from './colors/Color';
import Label from './Label';

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
        public from: number,
        public to: number,
        public step: number = 0,
        public color: ColorRepresentation = Colors.axis,
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
        }));
        this.calculateStepPositions();
    }

    calculateStepPositions() {
        if (this.step <= 0) return;
        for (let i = this.from; i <= this.to; i += this.step) {
            if (i === 0) continue;
            this.stepPositions.push(new Vector3(
                (this.name === 'x') ? i : 0,
                (this.name === 'y') ? i : 0,
                (this.name === 'z') ? i : 0
            ));
        }
    }
}

/**
 * TODO - Refactor and add tests for this class
 */
export default class Graph extends Object3D {
    constructor(
        private axes: axes,
        private outline: boolean = false,
        private outlineColor: ColorRepresentation = Colors.plot
    ) {
        super();
        this.drawAxis();
        this.outline && this.drawOutline();
        this.drawLabels();
    }

    drawAxis(): void {
        for (const axis of Object.keys(this.axes) as Array<'x' | 'y' | 'z'>) {
            const axisData = this.axes[axis];
            if (axisData) {
                const axisLine = new AxisLine(
                    axis,
                    axisData.from,
                    axisData.to,
                    axisData.step ?? 0,
                    axisData.color ?? Colors.axis
                );
                this.add(axisLine);
                axisData['axisLine'] = axisLine;
            }
        }

    }

    drawOutline() {
        for (const axis of Object.keys(this.axes) as Array<'x' | 'y' | 'z'>) {
            const axisData = this.axes[axis];
            (Object.keys(this.axes) as Array<'x' | 'y' | 'z'>).filter((name) => name !== axis).forEach((name) => {
                axisData?.axisLine?.stepPositions.forEach((point) => {
                    if (!this.axes[name]) return;
                    this.add(new Line({
                        from: new Vector3(
                            (name === 'x') ? this.axes[name].from : (axis === 'x' ? point.x : 0),
                            (name === 'y') ? this.axes[name].from : (axis === 'y' ? point.y : 0),
                            (name === 'z') ? this.axes[name].from : (axis === 'z' ? point.z : 0),
                        ),
                        to: new Vector3(
                            (name === 'x') ? this.axes[name].to : (axis === 'x' ? point.x : 0),
                            (name === 'y') ? this.axes[name].to : (axis === 'y' ? point.y : 0),
                            (name === 'z') ? this.axes[name].to : (axis === 'z' ? point.z : 0),
                        ),
                        color: this.outlineColor
                    }));
                });
            });
        }
    }

    drawLabels(): Object3D | void {
        for (const axis of Object.keys(this.axes) as Array<'x' | 'y' | 'z'>) {
            const axisData = this.axes[axis] as axis;
            axisData?.axisLine?.stepPositions.forEach((point, count) => {
                if (!axisData.label) return;
                const number = point[axis];
                const label = axisData.label === 'numeric' ? number.toString() : (axisData.label[count]?.name ?? '');
                const color = new Color(axisData.label === 'numeric' ? (axisData.lblColor ?? Colors.text) : (axisData.label[count]?.color ?? Colors.text));
                let slitPoints = {
                    from: new Vector3(0, 0, 0),
                    to: new Vector3(0, 0, 0)
                };
                switch (axis) {
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
                if (axis === 'x') {
                    if (number > 0) {
                        const xPosition = !axisData.labelCenter ? number - dimensions.x / 2 : count - number / 2 - dimensions.x / 2;
                        text.position.set(xPosition, -0.4, 0);
                    } else {
                        const xPosition = !axisData.labelCenter ? (number - dimensions.x / 2) : count + number / 2 - dimensions.x / 2;
                        text.position.set(xPosition - 0.05, -0.4, 0);
                    }
                }
                if (axis === 'y') {
                    text.position.set(-dimensions.x - 0.2, number - 0.1, 0);
                }
                if (axis === 'z') {
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
}
