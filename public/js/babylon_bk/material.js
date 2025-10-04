import * as COMPONENT_TYPE from "../babylon/const/componentType.js";
import * as LAYER from "../babylon/const/layer.js";
import * as STATUS from "../babylon/const/status.js";
import { singlePillar } from "./material/singlePillar.js";
import { terraceTile } from "./material/terraceTile.js";
import { width, height, BOARD_SIZE, MAX_LAYER } from "./const/material.js";
import * as three from "./three.js"
import * as dom from "../babylon/utils/dom.js"
import { stair } from "./material/stair.js";

// ---------------------------------------------
// コンポーネント情報
// ---------------------------------------------
let previewComponent = COMPONENT_TYPE.SINGLE_PILLAR;
// ---------------------------------------------
// レイヤー走査
// ---------------------------------------------
/** 3D @type { (callback: (x: number, y: number, z: number)=>void) => void } */
export const traverseAll = (callback) => {for(let y=0;y<MAX_LAYER;y++) { for (let x=0;x<BOARD_SIZE;x++){for(let z=0;z<BOARD_SIZE;z++){callback(x, y, z)}}}} 
/** 2D @type { (callback: (x: number, z: number)=>void) => void } */
export const traverseLayer = (callback) => {for(let x=0; x<BOARD_SIZE; x++) { for (let z=0;z<BOARD_SIZE;z++){callback(x, z)}}}
/** @type {(x: number, y: number, z: number) => string } */
export const p = (x, y, z) => `${x},${y},${z}`

// ---------------------------------------------
// コンポーネント操作関数
// ---------------------------------------------
// 格子座標を Three.Vector3.position に変換する
const convertPosition = (x, y, z) => ({ x: width * (x - 3.5), y: height * y + 1, z: width * (z - 3.5) });
// clone
export const clone = (component, x, y, z) => {
    let clonedObject = null;
    switch (component) {
        case COMPONENT_TYPE.SINGLE_PILLAR: clonedObject = singlePillar.clone(); break;
        case COMPONENT_TYPE.TERRACE_TILE: clonedObject = terraceTile.clone(); break;
        case COMPONENT_TYPE.STAIR: clonedObject = stair.clone(); break;
        default: return null;
    }
    if (!clonedObject.material) {
        clonedObject.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                
            }
        });
    }
    clonedObject.layers.set(LAYER.HIDDEN);
    clonedObject.name = `${component}#${x},${y},${z}`;
    clonedObject.userData.layer = LAYER.HIDDEN;
    const pos = convertPosition(x, y, z)
    clonedObject.position.x = pos.x;
    clonedObject.position.y = pos.y;
    clonedObject.position.z = pos.z;
    return clonedObject;
}
// ステータス変更
export const setStatus = (source, status) => {
    if (!source) return;
    if (source.material) {
        setObjectStatus(source, status);
    } else {
        // グループの場合
        source.traverse((child) => {
            if (child.isMesh) setObjectStatus(child, status);
        });
    }
    switch (status) {
        case STATUS.CONFIRMED:
            source.userData.layer = LAYER.CONFIRMED;
            break;
        case STATUS.PREVIEW:
            source.userData.layer = LAYER.PREVIEW;
            break;
        // case STATUS.SELECTED:
        //     source.userData.layer = LAYER.SELECTED;
        //     break;
        default:
            source.layers.set(LAYER.HIDDEN);
    }
}
const setObjectStatus = (source, status) => {
    source.material.transparent = true
    if (source.userData.isHitBox) {
        switch (status) {
            case STATUS.CONFIRMED:
                source.layers.set(LAYER.CONFIRMED);
                source.material.opacity = 0.0;
                break;
            case STATUS.HOVER:
                source.layers.set(LAYER.PREVIEW);
                source.material.opacity = 0.3;
                break;
            case STATUS.SELECTED:
                source.layers.set(LAYER.PREVIEW);
                source.material.opacity = 0.3;
                break;
            case STATUS.PREVIEW:
                source.layers.set(LAYER.PREVIEW);
                source.material.opacity = 0.0;
                break;
            default:
                source.layers.set(LAYER.HIDDEN);
                source.material.opacity = 0.0;
        }
    } else {
        switch (status) {
            case STATUS.CONFIRMED:
                source.layers.set(LAYER.CONFIRMED);
                source.material.opacity = 1.0;
                break;
            case STATUS.PREVIEW:
                source.layers.set(LAYER.PREVIEW);
                source.material.opacity = 0.1;
                break;
            case STATUS.HOVER:
                source.material.opacity = 0.8;
                break;
            case STATUS.SELECTED:
                // source.layers.set(LAYER.SELECTED);
                source.material.opacity = 1;
                break;
            default:
                source.layers.set(LAYER.HIDDEN);
        }
    }
}

// ---------------------------------------------
// mapInfo 操作関数
// ---------------------------------------------
// 基本情報
const mapInfo = { [STATUS.HIDDEN]: {}, [STATUS.PREVIEW]: {}, [STATUS.SELECTED]: {}, [STATUS.CONFIRMED]: {} };
export const get = (status, component, x, y, z) => mapInfo[status][component].get(p(x, y, z));
/** setter @type { (status: string, component: COMPONENT_TYPE, x: number, y: number, z: number, value: ThreeObject) => void} */
export const set = (status, component, x, y, z, value) => mapInfo[status] [component].set(p(x, y, z), value);
// init map
export const initMapInfo = () => {
    mapInfo.hidden = { terraceTile: new Map(), 
        [COMPONENT_TYPE.SINGLE_PILLAR]: initMapInfoComponent(COMPONENT_TYPE.SINGLE_PILLAR), 
        [COMPONENT_TYPE.STAIR]: initMapInfoComponent(COMPONENT_TYPE.STAIR),
    };

    preview(COMPONENT_TYPE.SINGLE_PILLAR)
    
    // eventListener
    three.addEventListener('mousemove', mouseMoveHandler);
    three.addEventListener('click', mouseClickHandler);
    dom.setOnclick("confirm", clickConfirmHandler);
};

// init component
const initMapInfoComponent = (component) => {
    // コンポーネント初期化
    const ret = new Map();
    // traverseAll((x, y, z) => {
    traverseLayer((x, z) => {
        const y = 0;
        const source = clone(component, x, y, z); // clone
        ret.set(p(x, y, z), source); // set map
        setStatus(source, STATUS.HIDDEN);
        three.append(source);
    })
    return ret;
}
// コンポーネントのステータスを変更する
export const changeStatus = (sourceStatus, targetStatus, component, x, y, z) => {
    const source = get(sourceStatus, component, x, y, z);
    mapInfo[sourceStatus][component].delete(p(x, y, z));
    set(targetStatus, component, x, y, z, source);
}
// プレビューの切替
export const preview = (component) => {
    mapInfo.hidden[component].forEach((source, key) => {
        setStatus(source, STATUS.PREVIEW)
    })
    mapInfo.preview[component] = mapInfo.hidden[component]
    mapInfo.hidden[component].clear();
}
// プレビューの終了
export const setComponentHidden = (component) => { 
    mapInfo.preview[component].forEach((value, key) => {
        value.setLayer(LAYER.HIDDEN);
        mapInfo.hidden.set(key, value)
        // クリア
        mapInfo.preview[component].clear()
    })
}

// ---------------------------------------------
// イベント
// ---------------------------------------------
let previewObject = null;
const selectedObject = [];
const mouseMoveHandler = (e) => {
    three.setMouse(e, "hover-pos")

    // -------------------------
    // プレビュー
    // -------------------------
    const targetObject = three.getRaycasterIntersectObjects();
    // console.log(targetObject)
    if (!targetObject) return;
    dom.setInnerText("hover-object", targetObject.name)
    if (targetObject.userData.layer == LAYER.PREVIEW) {
        for (let i=0;i<selectedObject.length;i++) {
            if (selectedObject[i].name === targetObject.name) {
                setStatus(previewObject, STATUS.PREVIEW);
                previewObject = null;
                return
            };
        }
        if (previewObject) {
            console.log(previewObject.name)
            if (previewObject.name === targetObject.name) return;
            setStatus(previewObject, STATUS.PREVIEW)
        }
        previewObject = targetObject;
        setStatus(previewObject, STATUS.HOVER);
    } else {
        setStatus(previewObject, STATUS.PREVIEW);
        previewObject = null
    }
}

// マウスクリックイベントハンドラ
const mouseClickHandler = (e) => {
    three.setMouse(e, "click-pos")
    
    // -------------------------
    // オブジェクトを取得
    // -------------------------
    const targetObject = three.getRaycasterIntersectObjects()
    if (!targetObject) {
        console.log("なにもないよ")
        return;
    }
    if (targetObject.userData.layer == LAYER.PREVIEW) {
        // もう一度クリックされた場合は解除する
        for (let i=0;i<selectedObject.length;i++) {
            if (selectedObject[i].name === targetObject.name) {
                setStatus(targetObject, STATUS.HOVER)
                selectedObject.splice(i, 1)
                previewObject = targetObject;
                console.log(targetObject.name)
                return
            }
        }
        console.log("選択中に設定", targetObject.name)
        // 選択中に設定
        setStatus(targetObject, STATUS.SELECTED)
        // プレビュー中オブジェクトとして保持
        selectedObject.push(targetObject)
        if (previewObject) {
            previewObject = null;
        }
    }
    dom.setInnerText("click-object", targetObject.name);

    dom.setInnerHTML("selected-object", selectedObject.map((v)=>v.name).join("<br>"));
}


// 確定ボタン
const clickConfirmHandler = () => {
    dom.setInnerText("message", "confirmed") 
    // // 整合性チェック
    // for (let i=0;i<selectedObject.length;i++) {
    //     // 座標に既存のコンポーネントがある場合はNG
    //     const {x,y,z} = selectedObject[i].userData.position
    //     if (componentData[y][x][z].component !== COMPONENT_TYPE.NONE) {
    //         dom.setInnerText("message", "配置済みのコンポーネントと重なっています。")
    //         return 
    //     }
    //     if (selectedObject[i].userData.component === COMPONENT_TYPE.TERRACE_TILE) {
    //         const cnt = componentData[y][x][z].tileNo
    //             + componentData[y][x+1][z].tileNo
    //             + componentData[y][x][z+1].tileNo
    //             + componentData[y][x+1][z+1].tileNo;
    //         console.log(selectedObject[i].name, cnt)
    //         if (cnt > 0) {
    //             dom.setInnerText("message", "配置済みのタイルと重なっています。")
    //             return 
    //         }
    //     }
    // }
    
    // 確定
    for (let i=0;i<selectedObject.length;i++) {
        setStatus(selectedObject[i], STATUS.CONFIRMED)
        // 座標
        // const {x,y,z} = selectedObject[i].userData.position
        // if (selectedObject[i].userData.component === COMPONENT_TYPE.TERRACE_TILE) {
        //     // テラスタイル
        //     componentData[y][x][z].tileNo = tileNo
        //     componentData[y][x+1][z].tileNo = tileNo
        //     componentData[y][x][z+1].tileNo = tileNo
        //     componentData[y][x+1][z+1].tileNo = tileNo
        //     tileNo++
        //     if (componentData[y-1][x][z].component === COMPONENT_TYPE.NONE) {
        //         // 直下がない場合
        //         componentData[y-1][x][z].component = COMPONENT_TYPE.UNPLACEBLE // 設置不可
        //         // componentData[y][x][z].component = COMPONENTS.OBSERVATORY // 展望台を設置
        //     } else if (componentData[y][x][z].component !== COMPONENT_TYPE.PILLAR) {
        //         // 柱以外の場合
        //         // componentData[y][x][z].component = COMPONENTS.OBSERVATORY // 展望台を設置
        //     }
        // } else {
        //     // その他
        //     componentData[y][x][z].component = selectedObject[i].userData.component
        // }
    }
    selectedObject.length = 0;
    dom.setInnerHTML("selected-object", "");
}
