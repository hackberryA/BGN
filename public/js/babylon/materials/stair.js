import * as THREE from 'three';
import { componentColor, componentHeight, COMPONENTS, componentWidth, defaultData } from "../const.js";
import { getPosition } from "./common.js";

const steps = 10; // 段数
const stepwidth= componentWidth / 15
const stepHeight = componentHeight / 10
const stepMaterial = new THREE.MeshStandardMaterial({color: componentColor});
const stair = new THREE.Group();
for (let i = 1; i <= steps; i++) {
    const geometry = new THREE.BoxGeometry (componentWidth / 2, stepHeight * i, stepwidth);
    const step = new THREE.Mesh (geometry, stepMaterial);
    step.position.set(.0, stepHeight / 2 * i, stepwidth * (i-3));
    stair.add(step);
}
const geometry = new THREE.BoxGeometry (componentWidth / 2, stepHeight / 2, componentWidth / 1.34);
const step = new THREE.Mesh(geometry, stepMaterial);
step.position.set(0, componentHeight, stepwidth * 13);
stair.add(step);
stair.userData = {...defaultData, component: COMPONENTS.STAIR}

// debug y
// const ygeometry = new THREE.BoxGeometry (0.1, componentHeight * 10, 0.1);
// const.ystep = new THREE.Mesh (ygeometry, new THREE.MeshStandardMaterial({color: 0xFF0000]);
// stair.add(ystep)

export const create = (x,y,z,r = 0) => {
    const {px, py, pz} = getPosition(x,y,z);
    const newStair = stair.clone()
    newStair.position.x = px;
    newStair.position.y = py;
    newStair.position.z = pz;
    newStair.rotation.y = Math.PI / 2 * r;
    return newStair
}
