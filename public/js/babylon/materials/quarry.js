import { defaultData, componentWidth, COMPONENTS} from "../const.js";
import * as THREE from "three";

// --------------------------------------------------
// 採掘場ボード
// --------------------------------------------------
export const create = () => {
    const quarry = new THREE.Mesh(
        new THREE.PlaneGeometry (componentWidth * 10, componentWidth *.10),
        new THREE.MeshStandardMaterial({ color: 0xFFFAFF })
    );
    quarry.rotation.x= -Math.PI /2;
    quarry.userData = {
        ...defaultData, 
        // component: COMPONENTS.QUARRY
    };
    quarry.position.y = -1
    return quarry
}