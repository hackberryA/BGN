import { COMPONENT_LAYER, componentHeight, COMPONENTS, componentWidth, STATUS } from "./const.js";
import * as materials from "./materials.js";
import * as three from "./three.js";

// ---------------------------------------------
// コンポーネントの作成（共通関数）
// ---------------------------------------------
// 格子座標を Three.Vector3.position に変換する
const getPosition = (x, y, z) => {
    return {
        x: componentWidth * (x - 3.5),
        y: componentHeight * y + 1,
        z: componentWidth * (z - 3.5),
    }
};
// マテリアルのステータスを変更
const setObjectStatus = (object, status) =>  {
    if (status === STATUS.CONFIRMED) {
        object.layers.set(COMPONENT_LAYER.DEFAULT)
        object.material.visible = true
        object.material.opacity = object.userData.isHitBox ? 0 : 1.0;
    } else if (status === STATUS.PREVIEW) {
        object.layers.set(COMPONENT_LAYER.PREVIEW)
        object.material.visible = true
        object.material.opacity = object.userData.isHitBox ? 0 : 0.01;
    } else if (status === STATUS.HOVER) {
        object.layers.set(COMPONENT_LAYER.PREVIEW)
        object.material.visible = true
        object.material.opacity = object.userData.isHitBox ? 0.1 : 0.7;
    } else if (status === STATUS.SELECTED) {
        object.layers.set(COMPONENT_LAYER.SELECTED)
        object.material.visible = true
        object.material.opacity = object.userData.isHitBox ? 0.3 : 1;
    } else {
        object.layers.set(COMPONENT_LAYER.INVISIBLE)
    }
}
// ステータスを変更
export const setStatus = (object, status) => {
    if (!object) return;
    if (object.userData.status === status) return;
    object.userData.status = status
    if (object.userData.defaultPosition) {
        if (status === STATUS.SELECTED || status === STATUS.CONFIRMED) {
            object.position.y = object.userData.defaultPosition.y + 1;
        } else {
            object.position.y = object.userData.defaultPosition.y;
        }
    }
    if (object.material) {
        setObjectStatus(object, status)
    } else {
        // グループの場合、子 Mesh の material を個別化してコピー
        object.traverse((child) => {
            if (child.isMesh) setObjectStatus(child, status)
        });
    }
}
// 選択
const getComponent = (component) => {
    switch (component) {
        case COMPONENTS.SINGLE_PILLAR: return materials.pillar;
        case COMPONENTS.TERRACE_TILE: return materials.terraceTile;
    }
    return null;
}
// 作成
export const create = (component, x, y, z) => {
    const targetObject = getComponent(component)
    if (targetObject === null) return null;
    const cloneObject = targetObject.clone();
    // マテリアルをコピー
    if (targetObject.material) {
        cloneObject.material = targetObject.material.clone()
        cloneObject.material.transparent = true
    } else {
        // グループの場合、子 Mesh の material を個別化してコピー
        cloneObject.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.transparent = true
            }
        });
    }
    // デフォルトは不可視
    setStatus(cloneObject, STATUS.INVISIBLE)
    // 座標
    const pos = getPosition(x, y, z)
    // name
    cloneObject.name = `${component}#${x},${y},${z}`;
    // userdata
    cloneObject.userData = {
        component: component, // コンポーネントの種類
        status: STATUS.INVISIBLE, // 表示状態
        position: {x: x, y: y, z: z},
        defaultPosition: {x: pos.x, y: pos.y, z: pos.z},
    };
    cloneObject.position.x = pos.x;
    cloneObject.position.y = pos.y;
    cloneObject.position.z = pos.z;
    three.scene.add(cloneObject)
    return cloneObject;
}


// 初期設定
export const initComponents = () => {
    // プレイヤーボード
    three.scene.add(materials.playerBoard)
    for (let x=0; x<8; x++) {
        for (let z=0; z<8; z++) {
            for (let y=0; y<8; y++) {
                create(COMPONENTS.SINGLE_PILLAR, x, y, z);
                if (x<8 && z<8)create(COMPONENTS.TERRACE_TILE, x, y, z);
            }
        }
    }

    // 1段目の柱のみプレビュー状態にする
    for (let x=0; x<8; x++) {
        for (let z=0; z<8; z++) {
            const found = three.scene.getObjectByName(`${COMPONENTS.SINGLE_PILLAR}#${x},0,${z}`);
            setStatus(found, STATUS.PREVIEW)
        }
    }
}