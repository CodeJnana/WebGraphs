import { Scene } from "three";
import WebGraphsObject3D from "./WebGraphsObject3D";

export default class WebGraphsScene extends Scene {
    constructor() {
        super();
    }

    add(...objects: WebGraphsObject3D[]) {
        objects.forEach(object => object.beforeSceneAdd());
        return super.add(...objects);
    }
}