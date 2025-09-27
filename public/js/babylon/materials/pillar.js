import {componentHeight, COMPONENTS, componentWidth, defaultData, defaultMaterial} from "../const.js"
import * as THREE from "three";
import { clone, getPosition } from "./common.js";

const pillarWidth = componentWidth * 0.5;
const pillarHeight = componentHeight * 0.9

const baseGeometry = new THREE.BoxGeometry(pillarWidth, pillarWidth / 20, pillarWidth);

// ̇柱身
// radiusTop, radius Bottom, height
const shaftGeometry= new THREE.CylinderGeometry (pillarWidth / 4, pillarWidth/4, pillarHeight); 
const shaft = new THREE.Mesh(shaftGeometry, defaultMaterial);
shaft.position.y = pillarHeight / 2;

// 柱頭「
const capital = new THREE.Mesh (baseGeometry, defaultMaterial);
capital.position.y = pillarHeight;

// 柱基
const base = new THREE.Mesh (baseGeometry, defaultMaterial);
base.position.y = 0;

//グループ化
export const pillar = new THREE.Group();
pillar.add(shaft, capital, base);
pillar.name = "pillar";
pillar.userData = {component: COMPONENTS.SINGLE_PILLAR};


// debug y
// const ygeometry = new THREE.BoxGeometry (0.1, componentHeight * 10, 0.1);
// const ystep = new THREE.Mesh (ygeometry, new THREE.MeshStandardMaterial({color: 0xFF0000}));
// pillar.add(ystep)

// 作成
export function create(x, y, z) {
    const {px, py, pz} = getPosition(x,y,z);
    const newPillar = pillar.clone(true)
    newPillar.position.x = px;
    newPillar.position.y = py;
    newPillar.position.z = pz;
    return newPillar
}


export const setPreviewPoints = () => {
    for (let x=1; x<=8; x++) {
        for (let z=1; z<=8; z++) {
            clone(pillar, x, 1, z, true);
        }
    }
}
setPreviewPoints()