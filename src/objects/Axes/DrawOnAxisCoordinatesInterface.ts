import { Vector3 } from "three";
import Axis from "./Axis";

export default interface DrawOnAxisCoordinatesInterface {
    drawOnCoordinate(
        axis: Axis,
        point: {
            vector: Vector3,
            origin?: boolean
        },
        index: number
    ): void;
}