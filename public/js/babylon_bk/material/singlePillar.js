import { RoundedBoxGeometry } from 'RoundedBoxGeometry';
import * as THREE from "three";
import { defaultMaterial, getHitBox, height, unit, width } from "../const/material.js";

// シングル柱
export const singlePillar = new THREE.Group();

// --------------------------------------------------
// ̇柱身
// --------------------------------------------------
// CylinderGeometry(radiusTop, radius Bottom, height)
const shaftGeometry= new THREE.CylinderGeometry(unit(4), unit(4), unit(14), 100, 1, true); 

// 頂点操作
const posAttr = shaftGeometry.attributes.position;
const vertex = new THREE.Vector3();
for (let i=0; i<posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);
    // 円柱の周囲に沿って角度でsin波をかける
    const angle =  Math.atan2(vertex.z, vertex.x); // φ = atan2(z, x)
    const reduction = 0.3 * Math.sin(30 * angle); // 溝の深さ, 溝の数
    const r = Math.sqrt(vertex.x ** 2 + vertex.z ** 2);
    const newR = r - reduction;
    vertex.x = newR * Math.cos(angle);
    vertex.z = newR * Math.sin(angle);
    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
}
posAttr.needsUpdate = true;
shaftGeometry.computeVertexNormals(); // ライティングのために法線を再計算


// --------------------------------------------------
// ̇柱頭、柱基
// --------------------------------------------------
const shaft = new THREE.Mesh(shaftGeometry, defaultMaterial);
shaft.position.y = height / 2;

//柱頭
const capital = new THREE. Mesh(
    new RoundedBoxGeometry (width/2, unit(2), width/2, 1, -0.2), // RoundedBoxGeometry (幅 高さ, 奥行, セグメント数。 角の半径) 
    defaultMaterial
);
capital.position.y = height - 2;

// 柱基
const base = capital.clone();
base.position.y = 2;


// グループ化
singlePillar.add(getHitBox(), shaft, capital, base);

// // debug y
// const ygeometry = new THREE.BoxGeometry(0.1, height * 10, 0.1);
// const ystep = new THREE.Mesh(ygeometry, new THREE.MeshStandardMaterial({color: 0xFF0000}));
// singlePillar.add(ystep)
