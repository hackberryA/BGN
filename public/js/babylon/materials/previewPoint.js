import * as THREE from "three";
import { componentWidth, defaultData, COMPONENTS } from "../const.js";
import * as three from "../three.js";
import { getPosition, clone } from "./common.js";

// --------------------------------------------------
// プレビュー可能位置の配置
// --------------------------------------------------

// SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
const previewPoint = new THREE.Mesh(
    new THREE.SphereGeometry(componentWidth / 4),
    new THREE.MeshStandardMaterial({ color: 0xFFFAFF, transparent: true, opacity: 0.2 })
)
previewPoint.userData.component = COMPONENTS.PREVIEW_POINT;
previewPoint.userData.preview = true;


export const create = (x, y, z) => clone(previewPoint.clone(), x, y, z);

export const setPreviewPoints = () => {
    for (let x=1; x<=8; x++) {
        for (let z=1; z<=8; z++) {
            clone(previewPoint, x, 1, z);
        }
    }
}
