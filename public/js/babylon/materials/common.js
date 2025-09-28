import { componentHeight, componentWidth, defaultData } from "../const.js"
import * as three from '../three.js';


// オブジェクトの作成
export const clone = (targetObject, x, y, z, preview=false) => {
    const pos = getPosition(x, y, z)
    const cloneObject = targetObject.clone(true);
    if (targetObject.material) {
        cloneObject.material = targetObject.material.clone()
    } else {
        // 子 Mesh の material を個別化
        cloneObject.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                if (preview) {
                    child.material.transparent = true;
                    child.material.opacity = 0.1;
                }
            }
        });
    }
    cloneObject.name = `${targetObject.userData.component}(${x},${y},${z})`;
    if (targetObject.userData.preview) cloneObject.name += '-preview';
    cloneObject.userData = {
        ...defaultData, 
        position: pos,
        ...targetObject.userData,
        preview: preview,
    };
    cloneObject.position.x = pos.x;
    cloneObject.position.y = pos.y;
    cloneObject.position.z = pos.z;
    three.scene.add(cloneObject)
    // console.log(cloneObject.name)
    return cloneObject;
}