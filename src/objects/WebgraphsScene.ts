import { Scene } from "three";

export default class WebGraphsScene extends Scene {
    constructor() {
        super();
    }

    add(...objects: any[]) {
        objects.forEach((object) => {
            if (object.draw) {
                object.draw();
            }
        });
        return super.add(...objects);
    }
}