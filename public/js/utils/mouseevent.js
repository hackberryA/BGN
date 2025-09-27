
import * as THREE from 'three';
import * as three from '../babylon/three.js';

//オブジェクトの (pisition, rotation, scale) をコピー
const focusMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false,
    transparent: true,
    opacity: 0.67
});
export const setFocus = (targetObject) => {
    let cloneObject = targetObject.clone()
    cloneObject = new THREE.Mesh (targetObject.geometry.clone(), focusMaterial);
    cloneObject.position.copy(targetObject.position);
    cloneObject.rotation.copy(targetObject.rotation);
    cloneObject.scale.copy(targetObject.scale);
    three.scene.add(cloneObject);
    return cloneObject
}
