import * as THREE from "three";
import { defaultMaterial, height, getHitBox, width } from "../const/material.js";

// --------------------------------------------------
// 階段
// --------------------------------------------------
export const stair = new THREE.Group();
const steps = 15; // 段数
const stepwidth = width * 0.75 / steps;
const stepHeight = height / (steps-1);
for (let i = 1; i <= steps; i++) {
    // BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
    const geometry = new THREE.BoxGeometry(width / 2, stepHeight * i, stepwidth);
    const step = new THREE.Mesh(geometry, defaultMaterial);
    step.position.set(0, stepHeight / 2 * i, stepwidth * (i-3));
    stair.add(step);
}
const geometry = new THREE.BoxGeometry(width / 2, stepHeight, width * 0.8);
const step = new THREE.Mesh(geometry, defaultMaterial);
step.position.set(0, height * 1.1, width * 0.9);


function randInt(min, max) {
  min = Math.ceil(min); // 最小値を切り上げる
  max = Math.floor(max); // 最大値を切り捨てる
  return Math.floor(Math.random() * (max - min + 1)) + min; // 最小値と最大値を含むランダムな整数を生成
}

stair.add(step, getHitBox());

// debug y
// const ygeometry = new THREE.BoxGeometry(0.1, height * 10, 0.1);
// const ystep = new THREE.Mesh(ygeometry, new THREE.MeshStandardMaterial({color: 0xFF0000}));
// stair.add(ystep)
// stair.rotation.y = -Math.PI/2 * randInt(1, 4)

