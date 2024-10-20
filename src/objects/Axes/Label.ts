import { Box3, ColorRepresentation, Vector3 } from "three";
import { Colors } from "../colors/Color";
import TextLabel from '../Label';
import Axis from "./Axis";
import DrawOnAxisCoordinatesInterface from "./DrawOnAxisCoordinatesInterface";

export enum ClockTurn {
    ZERO = 0,
    ONE = Math.PI / 4,
    TWO = Math.PI / 2,
    THREE = Math.PI * 3 / 4,
    FOUR = Math.PI,
    FIVE = Math.PI * 5 / 4,
    SIX = Math.PI * 3 / 2,
    SEVEN = Math.PI * 7 / 4
}

export default class Label implements DrawOnAxisCoordinatesInterface {
    private distanceFromAxis;
    private text: TextLabel = new TextLabel({
        position: new Vector3(0, 0, 0),
        text: ''
    });

    constructor(
        private type: number | Array<{ name: string, color?: ColorRepresentation, distanceFromAxis?: number }>,
        private color: ColorRepresentation = Colors.text,
        private fontSize: number = 1.30,
        private centered: boolean = false, // center label in between two coordinates
        private positionFromAxis = -2.5,
        private turn: ClockTurn = ClockTurn.ZERO
    ) {
        this.distanceFromAxis = positionFromAxis;
    }

    drawOnCoordinate(
        axis: Axis,
        point: {
            vector: Vector3,
            origin?: boolean
        },
        index: number
    ) {
        // ignore origin
        if (point.origin) return;
        let coordinatePoint = point.vector[axis.name];
        if (this.centered) {
            coordinatePoint = (coordinatePoint < 0) ? coordinatePoint + axis.coordinateDistance / 2 : coordinatePoint - axis.coordinateDistance / 2;
        }

        this.setLabel(coordinatePoint, index);

        this.distanceFromAxis = this.positionFromAxis;
        if (typeof this.type === 'object' && this.type[index]) {
            this.distanceFromAxis = this.type[index].distanceFromAxis ?? this.positionFromAxis;
        }

        const dimensions = new Box3().setFromObject(this.text).getSize(new Vector3());
        switch (axis.name) {
            case 'x':
                this.textOnXAxis(coordinatePoint, dimensions);
                break;
            case 'y':
                this.textOnYAxis(coordinatePoint, dimensions);
                break;
            case 'z':
                this.textOnZAxis(coordinatePoint, dimensions);
                break;
        }

        axis.add(this.text);
    }

    setLabel(point: number, index: number) {
        let label = '';
        let labelColor = this.color;
        if (typeof this.type === 'number') {
            label = (this.type > 0) ? ((this.type) * point).toString() : ((this.type) * point).toString();
            label = Math.round(parseFloat(label) * 100) / 100 + '';
        }

        if (typeof this.type === 'object' && this.type[index]) {
            label = this.type[index].name;
            labelColor = this.type[index].color ?? this.color;
        }

        this.text = new TextLabel({
            position: new Vector3(0, 0, 0),
            text: label,
            textSize: this.fontSize,
            color: labelColor,
        });
    }

    textOnXAxis(point: number, dimensions: Vector3) {
        let yPosition = (this.distanceFromAxis < 0) ? this.distanceFromAxis : this.distanceFromAxis + dimensions.y / 2;

        if (this.distanceFromAxis < 0) {
            switch (this.turn) {
                case ClockTurn.ONE:
                case ClockTurn.THREE:
                    yPosition = this.distanceFromAxis - dimensions.x / 2;
                    break;
                case ClockTurn.TWO:
                    yPosition = this.distanceFromAxis - dimensions.x;
                    break;
            }
        }

        if (this.distanceFromAxis > 0) {
            switch (this.turn) {
                case ClockTurn.SEVEN:
                    yPosition = this.distanceFromAxis + dimensions.x / 2;
                    break;
            }
        }

        if (point > 0) {
            const xPosition = point - dimensions.x / 2;
            this.text.position.set(xPosition, yPosition, 0);
        } else {
            const xPosition = point - dimensions.x / 2;
            this.text.position.set(xPosition - 0.05, yPosition, 0);
        }
        this.text.rotateZ(this.turn);
    }

    textOnYAxis(point: number, dimensions: Vector3) {
        const yAxis = (this.distanceFromAxis < 0) ? this.distanceFromAxis - dimensions.x : this.distanceFromAxis;
        this.text.position.set(yAxis, point - 0.5, 0);
    }

    textOnZAxis(point: number, dimensions: Vector3) {
        let yPosition = (this.distanceFromAxis < 0) ? this.distanceFromAxis : this.distanceFromAxis + dimensions.y / 2;
        if (point > 0)
            this.text.position.set(0, yPosition, point + dimensions.x / 2);
        else
            this.text.position.set(0, yPosition, point + (dimensions.x / 2) + 0.05);
        this.text.rotateY(Math.PI / 2);
    }
}