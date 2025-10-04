
import * as CANNON from 'CANON';
import { defaultMaterial } from "../const.js";
import * as THREE from "three";
export const create = (width, height, position, rotation) => {
    const geo = new THREE.BoxGeometry (width, height, 0.1);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.05
    });
    const mesh = new THREE.Mesh (geo, mat);
    mesh.position.copy(position);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    const shape = new CANNON. Box (new CANNON.Vec3(width/2, height/2, 0.05));
    const body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape,
        material: defaultMaterial,
        position: new CANNON.Vec3(position.x, position.y, position.z)
    });
    body.quaternion.setFromEuler (rotation.x, rotation.y, rotation.z);
    return [mesh, body]
}
