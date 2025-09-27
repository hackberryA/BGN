import * as THREE from "three";
import * as CANNON from "CANNON";
import {OrbitControls} from "OrbitControls"
import { COMPONENTS, defaultData } from "./const.js";
import { getPosition } from "./materials/common.js";

// --------------------------------------------------
// setup
// --------------------------------------------------
// canvas
export const canvas = document.querySelector(`#main`)
export const canvasWidth = window.innerWidth / 2;

// scene
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xF0F0F0);

// renderer
export const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasWidth, canvasWidth);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// camera
export const camera = new THREE. PerspectiveCamera (45, 1, 0.1, 10000); // (視野角, aspect ratio, near, far)
camera.position.set(300, 300, 300);
camera.lookAt(scene.position);

// OrbitControls
export const controls = new OrbitControls(camera, renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, .5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7);
// scene.add(hemi);
// const dir = new THREE.DirectionalLight(0xffffff, 0.6);
// dir.position.set(5,10,7);
// dir.castShadow = true;
// scene.add(dir);

// raycaster: マウス位置からまっすぐに伸びる光線ベクトルを生成
export const raycaster = new THREE.Raycaster();

//mouse
export const mouse = new THREE.Vector2(); // マウス五座標管理用ベクトル

// physics world
export const world = new CANNON. World({ gravity: new CANNON. Vec3(0, -9.82, 0) });


// --------------------------------------------------
// function
// --------------------------------------------------
// 現在カーソルが示すオブジェクトを取得
export const getRaycasterIntersectObjects = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length == 0) return null;

    const obj = intersects[0].object; // ヒットした Mesh
    return (obj.parent && obj.parent.type === "Group") ? obj.parent: obj;
}