import { ColorRepresentation, Vector3 } from 'three';
import Line from '../Line';
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

export default class Axis extends Line {
    public coordinates: Array<{ vector: Vector3 }> = []; // starts `from` from to `to` value

    constructor(
        public readonly props: AxisType = {
            name: 'x',
            from: 100,
            to: 100,
            coordinateDistance: 10,
            drawBetweenCoordinates: false,
            color: Colors.line,
            slitSize: .75,
            slitColor: Colors.line,
        }
    ) {
        super({
            from: new Vector3(
                (props.name === 'x') ? props.from : 0,
                (props.name === 'y') ? props.from : 0,
                (props.name === 'z') ? props.from : 0
            ),
            to: new Vector3(
                (props.name === 'x') ? props.to : 0,
                (props.name === 'y') ? props.to : 0,
                (props.name === 'z') ? props.to : 0
            ),
            color: props.color
        });

        if (this.props.from > 0 || this.props.to < 0 || (this.props.from == 0 && this.props.to == 0)) {
            throw new Error('Invalid axis range');
        }

        this.calculateCoordinates();
    }

    calculateCoordinates() {
        if (this.props.coordinateDistance <= 0) {
            throw new Error('Invalid coordinate distance');
        }

        for (let i = -this.props.coordinateDistance; i >= this.props.from; i -= this.props.coordinateDistance) {
            this.drawSlit(this.props.name, i);

            let point = i;
            if (this.props.drawBetweenCoordinates) {
                point = i + this.props.coordinateDistance / 2;
            }
            const vector = new Vector3(
                (this.props.name === 'x') ? point : 0,
                (this.props.name === 'y') ? point : 0,
                (this.props.name === 'z') ? point : 0
            );
            this.coordinates.push({ vector });
        }

        this.coordinates.push({ vector: new Vector3(0, 0, 0) });

        for (let i = this.props.coordinateDistance; i <= this.props.to; i += this.props.coordinateDistance) {
            this.drawSlit(this.props.name, i);

            let point = i;
            if (this.props.drawBetweenCoordinates) {
                point = i - this.props.coordinateDistance / 2;
            }
            const vector = new Vector3(
                (this.props.name === 'x') ? point : 0,
                (this.props.name === 'y') ? point : 0,
                (this.props.name === 'z') ? point : 0
            );
            this.coordinates.push({ vector });
        }
        this.drawPoints = this.coordinates;
    }

    drawSlit(name: 'x' | 'y' | 'z', point: number) {
        if (point === 0 || this.props.slitSize <= 0) {
            return; // Ignore origin
        }

        const slitPoints = {
            from: new Vector3(0, 0, 0),
            to: new Vector3(0, 0, 0)
        };

        switch (name) {
            case 'x':
                slitPoints.from.x = point;
                slitPoints.from.y = this.props.slitSize;
                slitPoints.to.x = point;
                slitPoints.to.y = -this.props.slitSize;
                break;
            case 'y':
                slitPoints.from.x = this.props.slitSize;
                slitPoints.from.y = point;
                slitPoints.to.x = -this.props.slitSize;
                slitPoints.to.y = point;
                break;
            case 'z':
                slitPoints.from.y = this.props.slitSize;
                slitPoints.from.z = point;
                slitPoints.to.y = -this.props.slitSize;
                slitPoints.to.z = point;
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
            if (axis.name.includes(this.props.name)) {
                throw new Error('Invalid parallel axis');
            }
        });
        pAxis.forEach((axis) => {
            this.drawFunctions.push((point: { vector: Vector3 }) => {
                // ignore origin
                if (point.vector.equals(new Vector3(0, 0, 0))) return;
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
                (axis.name === 'x') ? axis.props.from : (this.props.name === 'x' ? point.x + adjuster : 0),
                (axis.name === 'y') ? axis.props.from : (this.props.name === 'y' ? point.y + adjuster : 0),
                (axis.name === 'z') ? axis.props.from : (this.props.name === 'z' ? point.z + adjuster : 0),
            ),
            to: new Vector3(
                (axis.name === 'x') ? axis.props.to : (this.props.name === 'x' ? point.x + adjuster : 0),
                (axis.name === 'y') ? axis.props.to : (this.props.name === 'y' ? point.y + adjuster : 0),
                (axis.name === 'z') ? axis.props.to : (this.props.name === 'z' ? point.z + adjuster : 0),
            )
        }
    }

    public drawOnCoordinates(object: DrawOnAxisCoordinatesInterface) {
        this.drawFunctions.push((point: {
            origin?: boolean,
            vector: Vector3
        }, index: number) => {
            const object3D = object.drawOnCoordinate(this, point, index);
            if (object3D) {
                this.add(object3D);
            }
        });
    }
}
