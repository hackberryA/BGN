import * as CANNON from "CANNON";
import { OrbitControls } from "OrbitControls";
import * as THREE from "three";
import * as LAYER from "../babylon/const/layer.js";
import * as dom from "../babylon/utils/dom.js"

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

const canvas = document.querySelector(`#main`)
const canvasWidth = window.innerWidth / 2;
const scene = new THREE.Scene();
// @ts-ignore
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas});
const camera = new THREE. PerspectiveCamera (45, 1, 0.1, 10000); // (視野角, aspect ratio, near, far)
const controls = new OrbitControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster();
raycaster.layers.set(LAYER.PREVIEW)
const mouse = new THREE.Vector2(); // マウス五座標管理用ベクトル
const world = new CANNON. World({ gravity: new CANNON. Vec3(0, -9.82, 0) });

const clock = new THREE.Clock();
clock.start();

// gltf and vrm
// let currentVrm = undefined;
// Create a GLTFLoader - The loader for loading VRM models
// const loader = new GLTFLoader();
/** @type {(mesh: any) => void} */
export const append = (mesh) => { scene.add(mesh); }
export const render = () => { renderer.render(scene, camera); }
export const animate = () => { 
    // const deltaTime = clock.getDelta();
    // if (currentVrm) {
    //     currentVrm.humanoid.getNormalizedBoneNode( 'leftUpperArm' ).rotation.z = 0.75;
    //     // currentVrm.expressionManager.setValue('happy', 1.0);
    //     currentVrm.expressionManager.update();
    //     currentVrm.update( deltaTime );
    // }

    requestAnimationFrame(animate);
    render();

}

// --------------------------------------------------
// setup
// --------------------------------------------------
export const setup = () => {
    // scene
    scene.background = new THREE.Color(0xF0F0F0);

    // renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidth, canvasWidth);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // camera
    camera.position.set(300, 300, 300);
    camera.lookAt(scene.position);
    camera.layers.enable(LAYER.DEFAULT)
    camera.layers.enable(LAYER.PREVIEW)
    camera.layers.enable(LAYER.CONFIRMED)
    camera.layers.disable(LAYER.HIDDEN)

    // OrbitControls
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
    // 判定対象レイヤーだけ見る
    // ... Setup renderer, camera, scene ...


    // loader.crossOrigin = 'anonymous';
    // loader.register((parser) => {

    //     return new VRMLoaderPlugin(parser);

    // });


    // // Install a GLTFLoader plugin that enables VRM support
    // loader.register((parser) => {
    //     return new VRMLoaderPlugin(parser);
    // });

    // loader.load(
    //     // URL of the VRM you want to load
    //     'nanoha.vrm',

    //     (gltf) => {
    //         const vrm = gltf.userData.vrm;
    //         vrm.scene.scale.x = 2
    //         vrm.scene.scale.y = 2
    //         vrm.scene.scale.z = 2
    //         // console.log(vrm)
    //         VRMUtils.removeUnnecessaryVertices(gltf.scene);
    //         VRMUtils.removeUnnecessaryJoints(gltf.scene);
            
    //         vrm.scene.traverse((obj) => {
    //             obj.frustumCulled = false;
    //         });
            
    //         currentVrm = vrm;
    //         console.log(vrm);
    //         scene.add(vrm.scene);
    //     },
    //     (progress) => {
    //         // console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%')
    //     },
    //     (error) => console.error(error)
    // );

}

// --------------------------------------------------
// 現在カーソルが示すオブジェクトを取得
// --------------------------------------------------
export const getRaycasterIntersectObjects = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length == 0) return null;

    const obj = intersects[0].object; // ヒットした Mesh
    return (obj.parent && obj.parent.type === "Group") ? obj.parent: obj;
}

// リサイズ対応
// window.addEventListener('resize', () => three.renderer.setSize(three.canvasWidth, three.canvasWidth));
// export const getComponent = (component, x, y, z) => scene.getObjectByName(`${component}#${x},0,${z}`);

export const addEventListener = (id, handler) => canvas.addEventListener(id, handler);
export const setMouse = (e, id) => {
    // canvas要素の座標・幅・高さ
    const rect = e.currentTarget.getBoundingClientRect();
    // [-1, 1]の範囲で現在のマウス座標を登録する
    mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = -(e.clientY - rect.top) / rect.height * 2 + 1;

    if (id) dom.setInnerText(id, `(${mouse.x.toFixed(3)}, ${mouse.y.toFixed(3)})`)
}
