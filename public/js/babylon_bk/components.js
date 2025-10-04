// @ts-check
// import * as three from "./three.js";
// import * as LAYER from "./const/layer.js"
// import * as STATUS from "./const/status.js"
// import { height, initMapInfo, width } from "./material.js";
// import * as COMPONENT_TYPE from "./const/componentType.js"
// import { grid, playerBoard } from "./material/playerBoard.js";
// import { singlePillar } from "./material/singlePillar.js";
// import { terraceTile } from "./material/terraceTile.js";

// ---------------------------------------------
// コンポーネントの作成（共通関数）
// ---------------------------------------------
// 格子座標を Three.Vector3.position に変換する
/** @type { (x:number, y:number, z:number) => {x:number, y:number, z:number} } */
// const getPosition = (x, y, z) => {
//     return {
//         x: width * (x - 3.5),
//         y: height * y + 1,
//         z: width * (z - 3.5),
//     }
// };

// // マテリアルのステータスを変更
// /** @type {(object: any, status: string) => void} */
// const setObjectStatus = (object, status) =>  {
//     if (status === STATUS.CONFIRMED) {
//         object.layers.set(LAYER.DEFAULT)
//         object.material.visible = true
//         object.material.opacity = object.userData.isHitBox ? 0 : 1.0;
//     } else if (status === STATUS.PREVIEW) {
//         object.layers.set(LAYER.PREVIEW)
//         object.material.visible = true
//         object.material.opacity = object.userData.isHitBox ? 0 : 0.01;
//     // } else if (status === STATUS.HOVER) {
//     //     object.layers.set(LAYER.PREVIEW)
//     //     object.material.visible = true
//     //     object.material.opacity = object.userData.isHitBox ? 0.1 : 0.7;
//     } else if (status === STATUS.SELECTED) {
//         object.layers.set(LAYER.SELECTED)
//         object.material.visible = true
//         object.material.opacity = object.userData.isHitBox ? 0.3 : 1;
//     } else {
//         object.layers.set(LAYER.HIDDEN)
//     }
// }

// // ステータスを変更
// /** @type {(object: any, status: string) => void} */
// export const setStatus = (object, status) => {
//     if (!object) return;
//     if (object.userData.status === status) return;
//     object.userData.status = status
//     if (object.userData.defaultPosition) {
//         if (status === STATUS.SELECTED || status === STATUS.CONFIRMED) {
//             object.position.y = object.userData.defaultPosition.y + 1;
//         } else {
//             object.position.y = object.userData.defaultPosition.y;
//         }
//     }
//     if (object.material) {
//         setObjectStatus(object, status)
//     } else {
//         // グループの場合、子 Mesh の material を個別化してコピー
//         object.traverse((/** @type {any} */ child) => {
//             if (child.isMesh) setObjectStatus(child, status)
//         });
//     }
// }
// // 選択
// /** @type {(component: string) => any} */
// const getComponent = (component) => {
//     switch (component) {
//         case COMPONENT_TYPE.SINGLE_PILLAR: return singlePillar;
//         case COMPONENT_TYPE.TERRACE_TILE: return terraceTile;
//     }
//     return null;
// }
// // 作成
// /** @type {(component: string, x: number, y: number, z: number) => any} */
// export const create = (component, x, y, z) => {
//     const targetObject = getComponent(component)
//     if (targetObject === null) return null;
//     const cloneObject = targetObject.clone();
//     // マテリアルをコピー
//     if (targetObject.material) {
//         cloneObject.material = targetObject.material.clone()
//         cloneObject.material.transparent = true
//     } else {
//         // グループの場合、子 Mesh の material を個別化してコピー
//         cloneObject.traverse((/** @type {any} */ child) => {
//             if (child.isMesh) {
//                 child.material = child.material.clone();
//                 child.material.transparent = true
//             }
//         });
//     }
//     // デフォルトは不可視
//     setStatus(cloneObject, STATUS.HIDDEN)
//     // 座標
//     const pos = getPosition(x, y, z)
//     // name
//     cloneObject.name = `${component}#${x},${y},${z}`;
//     // userdata
//     cloneObject.userData = {
//         component: component, // コンポーネントの種類
//         status: STATUS.HIDDEN, // 表示状態
//         position: {x: x, y: y, z: z},
//         defaultPosition: {x: pos.x, y: pos.y, z: pos.z},
//     };
//     cloneObject.position.x = pos.x;
//     cloneObject.position.y = pos.y;
//     cloneObject.position.z = pos.z;
//     three.append(cloneObject)
//     return cloneObject;
// }


// // 初期設定
// export const initComponents = () => {
//     // // プレイヤーボード

//     for (let x=0; x<8; x++) {
//         for (let z=0; z<8; z++) {
//             for (let y=0; y<8; y++) {
//                 create(COMPONENT_TYPE.SINGLE_PILLAR, x, y, z);
//                 if (x<8 && z<8)create(COMPONENT_TYPE.TERRACE_TILE, x, y, z);
//             }
//         }
//     }

//     // 1段目の柱のみプレビュー状態にする
//     for (let x=0; x<8; x++) {
//         for (let z=0; z<8; z++) {
            
//         }
//     }
// }