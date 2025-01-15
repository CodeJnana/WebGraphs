import { ColorRepresentation, Vector3 } from "three";
import { Colors } from "../colors/Color";
import TextLabel, { ShiftType } from '../Label';
import Axis from "./Axis";
import DrawOnAxisCoordinatesInterface from "./DrawOnAxisCoordinatesInterface";

export enum TurnLabel {
    ZERO = 0,
    ONE = Math.PI / 4,
    TWO = Math.PI / 2,
    THREE = Math.PI * 3 / 4,
    FOUR = Math.PI,
    FIVE = Math.PI * 5 / 4,
    SIX = Math.PI * 3 / 2,
    SEVEN = Math.PI * 7 / 4
}

export enum MoveLabel {
    ZERO = 0,
    FIFETEEN = 15,
    THIRTY = 30,
    FOURTYFIVE = 45
}

export type YPRType = {
    yaw?: TurnLabel,
    pitch?: TurnLabel,
    roll?: TurnLabel
}

export type AxisLabelType = {
    type: number | Array<{ name: string, color?: ColorRepresentation, distanceFromAxis?: number }>,
    color: ColorRepresentation,
    fontSize: number,
    shift?: ShiftType | ShiftType[],
    ypr?: YPRType
};

export default class AxisLabel implements DrawOnAxisCoordinatesInterface {
    private text: TextLabel = new TextLabel({
        position: new Vector3(0, 0, 0),
        text: ''
    });

    constructor(
        private readonly props: AxisLabelType = {
            type: 1,
            color: Colors.text,
            fontSize: 1.3,
            shift: undefined
        }
    ) {
    }

    draw(
        axis: Axis,
        point: Vector3,
        index: number
    ) {
        // ignore origin
        if (point.x === 0 && point.y === 0 && point.z === 0) {
            return;
        }
        let coordinatePoint = point[axis.props.name];

        this.setLabel(coordinatePoint, index);

        this.text.setPosition(point, this.props.shift);

        if (this.props.ypr) {
            // TODO adjust distance from axis
            if (this.props.ypr.yaw) {
                this.text.rotateY(this.props.ypr.yaw);
            }
            if (this.props.ypr.pitch) {
                this.text.rotateX(this.props.ypr.pitch);
            }
            if (this.props.ypr.roll) {
                this.text.rotateZ(this.props.ypr.roll);
            }
        }

        return this.text;
    }

    setLabel(point: number, index: number) {
        let label = '';
        let labelColor = this.props.color;
        if (typeof this.props.type === 'number') {
            label = (this.props.type > 0) ? ((this.props.type) * point).toString() : ((this.props.type) * point).toString();
            label = Math.round(parseFloat(label) * 100) / 100 + '';
        }

        if (typeof this.props.type === 'object' && this.props.type[index]) {
            label = this.props.type[index].name;
            labelColor = this.props.type[index].color ?? this.props.color;
        }

        this.text = new TextLabel({
            position: new Vector3(0, 0, 0),
            text: label,
            textSize: this.props.fontSize,
            color: labelColor,
        });
    }
}