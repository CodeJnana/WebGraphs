import { Object3D } from "three";

export default class WebGraphsObject3D extends Object3D {
    protected drawPoints: Array<any> = [];
    protected drawFunctions: Array<Function> = [];
    constructor() {
        super();
    }

    draw = () => {
        this.drawPoints.forEach((pointData: any, pointIndex: number) => {
            this.drawFunctions.forEach((drawFunction: Function) => {
                drawFunction(pointData, pointIndex);
            });
        });
    };
}