import { Object3D, Vector3 } from "three";
import Axis from "./Axis";

export default interface DrawOnAxisCoordinatesInterface {
    draw(
        axis: Axis,
        point: Vector3,
        index: number
    ): Object3D | undefined;
}