import { PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";

export default function HoverActions(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    scene: Scene
) {
    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const objectsThatWereMadeTrasnparent: any[] = [];

    function onHover(event: MouseEvent) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        onHoverOut();
        const intersects = raycaster.intersectObject(scene, true);
        if (intersects.length > 0) {
            const object = intersects[0].object as any;
            if (object.hoverIn) {
                object.hoverIn();
            }
            objectsThatWereMadeTrasnparent.push(object);
        }
    }

    function onHoverOut() {
        objectsThatWereMadeTrasnparent.forEach((object) => {
            if (object.hoverOut) {
                object.hoverOut();
            }
        });
        objectsThatWereMadeTrasnparent.length = 0;
    }

    renderer.domElement.addEventListener('pointermove', onHover, false);
}