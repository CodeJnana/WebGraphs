import { ColorRepresentation, Object3D, Vector3 } from 'three';
import Line from '../Line';
import { Colors } from '../colors/Color';
import DrawOnAxisCoordinatesInterface from './DrawOnAxisCoordinatesInterface';

export default class Axis extends Object3D {
    private negativeCoordinates: Array<{
        origin?: boolean,
        vector: Vector3
    }> = []; // start from `zero` to `from` value

    private positiveCoordinates: Array<{
        origin?: boolean,
        vector: Vector3
    }> = []; // starts from `zero` to `to` value

    public coordinates: Array<{
        origin?: boolean,
        vector: Vector3
    }> = []; // starts `from` from to `to` value

    constructor(
        public readonly name: 'x' | 'y' | 'z',
        public readonly from: number,
        public readonly to: number,
        public readonly coordinateDistance: number,
        public readonly color: ColorRepresentation = Colors.line,
        public readonly slitColor: ColorRepresentation = Colors.line
    ) {
        super();

        if (this.from > 0 || this.to < 0 || (this.from == 0 && this.to == 0)) {
            throw new Error('Invalid axis range');
        }
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
            color: this.color
        }));
        this.calculateCoordinates();

        this.drawSlits();
    }

    calculateCoordinates() {
        if (!this.coordinateDistance) return;
        if (this.coordinateDistance <= 0) return;

        const centerPoint = 0;
        for (let i = centerPoint; i >= this.from; i -= this.coordinateDistance) {
            this.negativeCoordinates.push({
                vector: new Vector3(
                    (this.name === 'x') ? i : 0,
                    (this.name === 'y') ? i : 0,
                    (this.name === 'z') ? i : 0
                ),
                origin: i === 0
            });
        }

        for (let i = centerPoint; i <= this.to; i += this.coordinateDistance) {
            this.positiveCoordinates.push({
                vector: new Vector3(
                    (this.name === 'x') ? i : 0,
                    (this.name === 'y') ? i : 0,
                    (this.name === 'z') ? i : 0
                ),
                origin: i === 0
            });
        }

        if (this.negativeCoordinates.length > 0 && this.positiveCoordinates.length > 0) {
            this.negativeCoordinates.shift();
        }

        this.coordinates = [...this.negativeCoordinates.reverse(), ...this.positiveCoordinates];
    }

    drawSlits() {
        const slitSize = .75;
        this.coordinates.forEach((coordinate) => {
            // ignore origin
            if (coordinate.origin) return;
            let number = coordinate.vector[this.name];
            let slitPoints = {
                from: new Vector3(0, 0, 0),
                to: new Vector3(0, 0, 0)
            };
            switch (this.name) {
                case 'x':
                    slitPoints = {
                        from: new Vector3(number, slitSize, 0),
                        to: new Vector3(number, -slitSize, 0)
                    };
                    break;
                case 'y':
                    slitPoints = {
                        from: new Vector3(slitSize, number, 0),
                        to: new Vector3(-slitSize, number, 0)
                    };
                    break;
                case 'z':
                    slitPoints = {
                        from: new Vector3(0, slitSize, number),
                        to: new Vector3(0, -slitSize, number)
                    };
                    break;
            }

            const line = new Line({
                from: slitPoints['from'],
                to: slitPoints['to'],
                color: this.slitColor ?? this.color
            });
            line.mesh.renderOrder = 1;
            this.add(line);
        });
    }

    drawParallelAxis(pAxis: Axis[], color: ColorRepresentation = this.color) {
        pAxis.forEach((axis) => {
            if (axis.name.includes(this.name)) {
                throw new Error('Invalid parallel axis');
            }
        });
        pAxis.forEach((axis) => {
            this.coordinates.forEach((point) => {
                // ignore origin
                if (point.origin) return;
                const parallelPoints = this.getParallelAxisPoints(point.vector, axis);
                const line = new Line({
                    from: parallelPoints.from,
                    to: parallelPoints.to,
                    color: color
                });
                line.mesh.renderOrder = 0;
                this.add(line);
            });
        });
    }

    private getParallelAxisPoints(point: Vector3, axis: Axis): { from: Vector3, to: Vector3 } {
        return {
            from: new Vector3(
                (axis.name === 'x') ? axis.from : (this.name === 'x' ? point.x : 0),
                (axis.name === 'y') ? axis.from : (this.name === 'y' ? point.y : 0),
                (axis.name === 'z') ? axis.from : (this.name === 'z' ? point.z : 0),
            ),
            to: new Vector3(
                (axis.name === 'x') ? axis.to : (this.name === 'x' ? point.x : 0),
                (axis.name === 'y') ? axis.to : (this.name === 'y' ? point.y : 0),
                (axis.name === 'z') ? axis.to : (this.name === 'z' ? point.z : 0),
            )
        }
    }

    public drawOnCoordinates(object: DrawOnAxisCoordinatesInterface) {
        this.coordinates.forEach((point, index) => {
            object.drawOnCoordinate(this, point, index);
        });
    }
}
