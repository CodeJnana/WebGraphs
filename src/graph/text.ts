import { TextGeometry } from "three/examples/jsm/Addons.js";
import Draw from "../interface/Draw";
import * as THREE from 'three';
import { colors } from "./defaultColors";

declare const window: any;

export type textPosition = {
    x: number,
    y: number,
    z: number
}
export default class DrawText extends Draw {
    constructor(
        private position: textPosition,
        private text: string,
        private color: THREE.ColorRepresentation
    ) {
        super();
    }

    build() {
        const xText = new THREE.Mesh(
            new TextGeometry(this.text, {
                font: window.graph.font,
                size: 0.25,
                depth: 0,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: false
            }),
            new THREE.MeshBasicMaterial({ color: this.color })
        );
        xText.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );
        return xText;
    }
}