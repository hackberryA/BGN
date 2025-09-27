import * as dom from "../../utils/dom.js"
import { COMPONENTS } from "../const.js"
import { pillar } from "../materials/pillar.js";
import * as three from "../three.js";

// --------------------------------------------------
// コンポーネントの切り替えイベント
// --------------------------------------------------
const previewOpacity = 0.1
const previewedOpacity = .7
const selectedOpacity = 1.0

let previewObject = null; // プレビュー中
let selectedObject = null; // 選択中

// 初期処理
export const initialize = () => {
    three.canvas.addEventListener('mousemove', mouseMoveHandler);
    three.canvas.addEventListener('click', mouseClickHandler);
}

// 透明度を設定
const setOpacity = (obj, opacity) => {
    if (!obj || !obj.type) return
    if (obj.type === "Group") {
        obj.children.forEach(child => {
            child.material.opacity = opacity;
        });
    } else if (obj.material) {
        obj.material.opacity = opacity;
    }
}

// --------------------------------------------------
// マウス移動ハンドラ
// --------------------------------------------------
const mouseMoveHandler = (e) => {
    // -------------------------
    // 座標設定
    // -------------------------
    // canvas要素の座標・幅・高さ
    const rect = e.currentTarget.getBoundingClientRect();
    // [-1, 1]の範囲で現在のマウス座標を登録する
    three.mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
    three.mouse.y = -(e.clientY - rect.top) / rect.height * 2 + 1;
    dom.setInnerText("hover-pos", `(${three.mouse.x.toFixed(3)}, ${three.mouse.y.toFixed(3)})`)

    // -------------------------
    // オブジェクトを取得
    // -------------------------
    const currentObject = three.getRaycasterIntersectObjects()
    if (currentObject) {
        dom.setInnerText("hover-object", currentObject.name);

        // 選択中オブジェクトの場合はスキップ
        if (currentObject.userData.selected === true) return;

        if (currentObject.userData.preview === true) {
            // プレビュー用オブジェクトの場合
            if (previewObject) {
                // プレビュー中オブジェクトの透明度を戻す
                setOpacity(previewObject, previewOpacity);
            }
            // 透明度を上げる
            setOpacity(currentObject, previewedOpacity);
            previewObject = currentObject
        } else {
            if (previewObject) { 
                // 透明度を下げる
                setOpacity(previewObject, previewOpacity);
                previewObject = null
            }
        }
    } else {
        // オブジェクトがない場合、プレビューオブジェクトがあれば透明度を戻して削除
        setOpacity(previewObject, previewOpacity);
        previewObject = null
        dom.setInnerText("hover-object","")
    }
}

// マウスクリックイベントハンドラ
const mouseClickHandler = (e) => {
    // -------------------------
    // 座標設定
    // -------------------------
    // canvas要素の座標・幅・高さ
    const rect = e.currentTarget.getBoundingClientRect();
    // [-1, 1]の範囲で現在のマウス座標を登録する
    three.mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
    three.mouse.y = -(e.clientY - rect.top) / rect.height * 2 + 1;
    dom.setInnerText("click-pos", `(${three.mouse.x.toFixed(3)}, ${three.mouse.y.toFixed(3)})`)
    
    // -------------------------
    // オブジェクトを取得
    // -------------------------
    const currentObject = three.getRaycasterIntersectObjects()
    if (currentObject) {
        console.log(currentObject)
        // オブジェクトがある場合
        dom.setInnerText("click-object", currentObject.name);
        if (currentObject.userData.preview === true) {
            // 選択中オブジェクトの場合はスキップ
            if (currentObject.userData.selected === true) return;
            if (selectedObject) {
                console.log(selectedObject)
                // 選択中のオブジェクトの透明度を戻す
                selectedObject.userData.selected = false
                setOpacity(selectedObject, previewOpacity)
            }
            currentObject.userData.selected = true
            // 透明度を上げる
            setOpacity(currentObject, selectedOpacity);
            selectedObject = currentObject
            previewObject = null; // プレビューを削除
            dom.setInnerText("selected-object", currentObject.name);
        }
    } else {
        // オブジェクトがない場合、プレビューオブジェクトがあれば透明度を戻して削除
        // setOpacity(previewObject, previewOpacity);
        // previewObject = null
        dom.setInnerText("click-object","")
    }
}

const changeComponent = (component) => {
    
}


dom.setOnclick("selectTerraceTile", () => changeComponent(COMPONENTS.TERRACE_TILE))
dom.setOnclick("selectSinglePillar", () => changeComponent(COMPONENTS.SINGLE_PILLAR))
dom.setOnclick("selectDoublePillar", () => changeComponent(COMPONENTS.DOUBLE_PILLAR))
dom.setOnclick("selectFountain", () => changeComponent(COMPONENTS.FOUNTAIN))
dom.setOnclick("selectStair", () => changeComponent(COMPONENTS.STAIR))
dom.setOnclick("selectBridge", () => changeComponent(COMPONENTS.BRIDGE))
