import { ColorRepresentation, Vector3 } from 'three';
import Line from '../Line';
import WebGraphsObject3D from '../WebGraphsObject3D';
import { Colors } from '../colors/Color';
import DrawOnAxisCoordinatesInterface from './DrawOnAxisCoordinatesInterface';

export type AxisType = {
    name: 'x' | 'y' | 'z',
    from: number,
    to: number,
    coordinateDistance: number,
    drawBetweenCoordinates: boolean,
    color: ColorRepresentation,
    slitSize: number,
    slitColor: ColorRepresentation
}

export default class Axis extends WebGraphsObject3D {
    public coordinates: Array<Vector3> = []; // starts `from` from to `to` value
    private drawFunctions: Array<(pointData: Vector3, pointIndex: number) => void> = [];

    constructor(
        public readonly props: AxisType = {
            name: 'x',
            from: -100,
            to: 100,
            color: Colors.line,
            coordinateDistance: 10,
            drawBetweenCoordinates: false,
            slitSize: .75,
            slitColor: Colors.line,
        }
    ) {
        super();

        if (this.props.from > 0 || this.props.to < 0 || (this.props.from == 0 && this.props.to == 0)) {
            throw new Error('Invalid axis range');
        }

        this.calculateCoordinates();
    }

    drawLine() {
        const line = new Line({
            from: new Vector3(
                (this.props.name === 'x') ? this.props.from : 0,
                (this.props.name === 'y') ? this.props.from : 0,
                (this.props.name === 'z') ? this.props.from : 0
            ),
            to: new Vector3(
                (this.props.name === 'x') ? this.props.to : 0,
                (this.props.name === 'y') ? this.props.to : 0,
                (this.props.name === 'z') ? this.props.to : 0
            ),
            color: this.props.color
        });
        this.add(line);
    }

    calculateCoordinates() {
        if (this.props.coordinateDistance <= 0) {
            throw new Error('Invalid coordinate distance');
        }

        for (let i = -this.props.coordinateDistance; i >= this.props.from; i -= this.props.coordinateDistance) {
            let point = i;
            if (this.props.drawBetweenCoordinates) {
                point = i + this.props.coordinateDistance / 2;
            }
            const vector = new Vector3(
                (this.props.name === 'x') ? point : 0,
                (this.props.name === 'y') ? point : 0,
                (this.props.name === 'z') ? point : 0
            );
            this.coordinates.push(vector);
        }

        this.coordinates.push(new Vector3(0, 0, 0));

        for (let i = this.props.coordinateDistance; i <= this.props.to; i += this.props.coordinateDistance) {
            let point = i;
            if (this.props.drawBetweenCoordinates) {
                point = i - this.props.coordinateDistance / 2;
            }
            const vector = new Vector3(
                (this.props.name === 'x') ? point : 0,
                (this.props.name === 'y') ? point : 0,
                (this.props.name === 'z') ? point : 0
            );
            this.coordinates.push(vector);
        }
    }

    drawSlit(vector: Vector3) {
        if (this.props.slitSize <= 0) {
            return;
        }

        const slitPoints = {
            from: new Vector3(0, 0, 0),
            to: new Vector3(0, 0, 0)
        };

        switch (this.props.name) {
            case 'x':
                if (vector.x == 0) {
                    return;
                }
                slitPoints.from.x = vector.x;
                slitPoints.from.y = this.props.slitSize;
                slitPoints.to.x = vector.x;
                slitPoints.to.y = -this.props.slitSize;
                break;
            case 'y':
                if (vector.y == 0) {
                    return;
                }
                slitPoints.from.x = this.props.slitSize;
                slitPoints.from.y = vector.y;
                slitPoints.to.x = -this.props.slitSize;
                slitPoints.to.y = vector.y;
                break;
            case 'z':
                if (vector.z == 0) {
                    return;
                }
                slitPoints.from.y = this.props.slitSize;
                slitPoints.from.z = vector.z;
                slitPoints.to.y = -this.props.slitSize;
                slitPoints.to.z = vector.z;
                break;
        }

        const line = new Line({
            from: slitPoints.from,
            to: slitPoints.to,
            color: this.props.slitColor ?? this.props.color
        });
        line.mesh.renderOrder = 1;
        this.add(line);
    }

    drawParallelAxis(pAxis: Axis[], color: ColorRepresentation = this.props.color) {
        pAxis.forEach((axis) => {
            if (axis.props.name.includes(this.props.name)) {
                throw new Error('Invalid parallel axis');
            }
        });
        pAxis.forEach((axis) => {
            this.drawFunctions.push((point: Vector3) => {
                // ignore origin
                if (point.equals(new Vector3(0, 0, 0))) return;
                const parallelPoints = this.getParallelAxisPoints(point, axis);
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
        let adjuster = 0;
        if (this.props.drawBetweenCoordinates) {
            switch (this.props.name) {
                case 'x':
                    point.x < 0 && (adjuster = -this.props.coordinateDistance / 2);
                    point.x > 0 && (adjuster = this.props.coordinateDistance / 2);
                    break;
                case 'y':
                    point.y < 0 && (adjuster = -this.props.coordinateDistance / 2);
                    point.y > 0 && (adjuster = this.props.coordinateDistance / 2);
                    break;
                case 'z':
                    point.z < 0 && (adjuster = -this.props.coordinateDistance / 2);
                    point.z > 0 && (adjuster = this.props.coordinateDistance / 2);
                    break;
            }
        }

        return {
            from: new Vector3(
                (axis.props.name === 'x') ? axis.props.from : (this.props.name === 'x' ? point.x + adjuster : 0),
                (axis.props.name === 'y') ? axis.props.from : (this.props.name === 'y' ? point.y + adjuster : 0),
                (axis.props.name === 'z') ? axis.props.from : (this.props.name === 'z' ? point.z + adjuster : 0),
            ),
            to: new Vector3(
                (axis.props.name === 'x') ? axis.props.to : (this.props.name === 'x' ? point.x + adjuster : 0),
                (axis.props.name === 'y') ? axis.props.to : (this.props.name === 'y' ? point.y + adjuster : 0),
                (axis.props.name === 'z') ? axis.props.to : (this.props.name === 'z' ? point.z + adjuster : 0),
            )
        }
    }

    public drawOnCoordinates(draw: DrawOnAxisCoordinatesInterface) {
        this.drawFunctions.push((pointData: Vector3, pointIndex: number) => {
            const Object3D = draw.draw(this, pointData, pointIndex);
            if (!Object3D) return
            this.add(Object3D);
        });
    }

    public beforeSceneAdd = () => {
        this.drawLine();
        this.drawFunctions.push((point: Vector3) => this.drawSlit(point));

        this.coordinates.forEach((pointData: Vector3, pointIndex: number) => {
            this.drawFunctions.forEach(someFunction => someFunction(pointData, pointIndex))
        });
    }
}
