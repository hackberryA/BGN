import * as dom from "../../utils/dom.js"
import { componentData } from "../babyron.js";
import { setStatus } from "../components.js";
import { COMPONENTS, STATUS } from "../const.js"
import * as three from "../three.js";

let tileNo = 1
// プレビュー中のデータ
const selectedComponentData = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, ()=>({ tileNo: 0, component: COMPONENTS.NONE }))
    )
);
// --------------------------------------------------
// コンポーネントの切り替えイベント
// --------------------------------------------------
 // プレビュー中
let previewObject = null;
const setPreviewObject = (targetObject) => {
    if (targetObject) {
        if (previewObject && previewObject.name !== targetObject.name) setStatus(previewObject, STATUS.PREVIEW);
        setStatus(targetObject, STATUS.HOVER)
        previewObject = targetObject
        dom.setInnerText("hover-object", targetObject.name)
    } else {
        if (previewObject) setStatus(previewObject, STATUS.PREVIEW);
        previewObject = null
        dom.setInnerText("hover-object", "")
    }
}
// 周囲8マスのタイルの状態を変更する
const setAroundTerraceTileStatus = (component, position, tileNo, status1, status2) => {
    const {x,y,z} = position;

    // タイル番号を設定
    selectedComponentData[y][x][z].tileNo = tileNo;
    selectedComponentData[y][x+1][z].tileNo = tileNo;
    selectedComponentData[y][x][z+1].tileNo = tileNo;
    selectedComponentData[y][x+1][z+1].tileNo = tileNo;
    // setStatus
    for (let dx=-1;dx<=1;dx++) {
        for (let dz=-1;dz<=1;dz++) {
            if (dx===0 && dz===0) continue;
            // console.log(component, x+dx, y, z+dz, tileNo, status1, status2)
            const object = three.scene.getObjectByName(`${component}#${x+dx},${y},${z+dz}`);
            if (object.userData.status === status1) setStatus(object, status2);
        }
    }
}

// 選択中
const selectedObject = [];
const setSelectedObject = (targetObject, remove=false) => {
    if (targetObject) {
        if (targetObject.userData.status === STATUS.PREVIEW || targetObject.userData.status === STATUS.HOVER ) {
            // 選択中に設定
            setStatus(targetObject, STATUS.SELECTED)
            // プレビュー中オブジェクトとして保持
            selectedObject.push(targetObject)

            // プレビュー情報を変更
            const {x,y,z} = targetObject.userData.position
            if (targetObject.userData.component === COMPONENTS.TERRACE_TILE) {
                setAroundTerraceTileStatus(
                    targetObject.userData.component,
                    targetObject.userData.position,
                    tileNo,
                    STATUS.PREVIEW,
                    STATUS.PREINVISIBLE,
                );
                tileNo++;
            } else {
                selectedComponentData[y][x][z].component = targetObject.userData.component
            }
            
            previewObject = null
        } else if (targetObject.userData.status === STATUS.SELECTED) {
            // もう一度クリックされた場合は解除する
            setStatus(targetObject, STATUS.HOVER)
            for (let i=0;i<selectedObject.length;i++) {
                if (selectedObject[i].name === targetObject.name) {
                    selectedObject.splice(i, 1)
                    break;
                }
            }
            // タイル番号リセット
            setAroundTerraceTileStatus(
                targetObject.userData.component,
                targetObject.userData.position,
                0,
                STATUS.PREINVISIBLE,
                STATUS.PREVIEW,
            );
            previewObject = targetObject
        }
        dom.setInnerText("click-object", targetObject.name);
    } else {
        // オブジェクトがない場合、プレビューオブジェクトがあれば透明度を戻して削除
        // setOpacity(previewObject, previewOpacity);
        // previewObject = null
        dom.setInnerText("click-object","")
        if (remove) selectedObject.length = 0
    }
    dom.setInnerHTML("selected-object", selectedObject.map((v)=>v.name).join("<br>"));
}

// 初期処理
export const initialize = () => {
    three.canvas.addEventListener('mousemove', mouseMoveHandler);
    three.canvas.addEventListener('click', mouseClickHandler);
    dom.setOnclick("confirm", clickConfirmHandler)
    dom.setOnclick("reset", clickResetHandler)
    dom.setOnclick("selectTerraceTile", () => changePreviewComponent(COMPONENTS.TERRACE_TILE))
    dom.setOnclick("selectSinglePillar", () => changePreviewComponent(COMPONENTS.SINGLE_PILLAR))
    dom.setOnclick("selectDoublePillar", () => changePreviewComponent(COMPONENTS.DOUBLE_PILLAR))
    dom.setOnclick("selectFountain", () => changePreviewComponent(COMPONENTS.FOUNTAIN))
    dom.setOnclick("selectStair", () => changePreviewComponent(COMPONENTS.STAIR))
    dom.setOnclick("selectBridge", () => changePreviewComponent(COMPONENTS.BRIDGE))

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
    // プレビュー
    // -------------------------
    const targetObject = three.getRaycasterIntersectObjects()
    if (targetObject && (targetObject.userData.status === STATUS.PREVIEW || targetObject.userData.status === STATUS.HOVER))
    {
        setPreviewObject(targetObject)
    } else {
        setPreviewObject(null)
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
    const targetObject = three.getRaycasterIntersectObjects()
    setSelectedObject(targetObject)
}

// 確定ボタン
const clickConfirmHandler = () => {
    dom.setInnerText("message", "confirmed") 
    // 整合性チェック
    for (let i=0;i<selectedObject.length;i++) {
        // 座標に既存のコンポーネントがある場合はNG
        const {x,y,z} = selectedObject[i].userData.position
        if (componentData[y][x][z].component !== COMPONENTS.NONE) {
            dom.setInnerText("message", "配置済みのコンポーネントと重なっています。")
            return 
        }
        if (selectedObject[i].userData.component === COMPONENTS.TERRACE_TILE) {
            const cnt = componentData[y][x][z].tileNo
                + componentData[y][x+1][z].tileNo
                + componentData[y][x][z+1].tileNo
                + componentData[y][x+1][z+1].tileNo;
            console.log(selectedObject[i].name, cnt)
            if (cnt > 0) {
                dom.setInnerText("message", "配置済みのタイルと重なっています。")
                return 
            }
        }
    }
    
    // 確定
    for (let i=0;i<selectedObject.length;i++) {
        setStatus(selectedObject[i], STATUS.CONFIRMED)
        // 座標
        const {x,y,z} = selectedObject[i].userData.position
        if (selectedObject[i].userData.component === COMPONENTS.TERRACE_TILE) {
            // テラスタイル
            componentData[y][x][z].tileNo = tileNo
            componentData[y][x+1][z].tileNo = tileNo
            componentData[y][x][z+1].tileNo = tileNo
            componentData[y][x+1][z+1].tileNo = tileNo
            tileNo++
            if (componentData[y-1][x][z].component === COMPONENTS.NONE) {
                // 直下がない場合
                componentData[y-1][x][z].component = COMPONENTS.UNPLACEBLE // 設置不可
                // componentData[y][x][z].component = COMPONENTS.OBSERVATORY // 展望台を設置
            } else if (componentData[y][x][z].component !== COMPONENTS.PILLAR) {
                // 柱以外の場合
                // componentData[y][x][z].component = COMPONENTS.OBSERVATORY // 展望台を設置
            }
        } else {
            // その他
            componentData[y][x][z].component = selectedObject[i].userData.component
        }
    }
    selectedObject.length = 0;
    selectedComponentData.length = 0
    for (let y=0; y<8; y++) {
        selectedComponentData.push(
            Array.from({ length: 8 }, () =>
                Array.from({ length: 8 }, ()=>({ tileNo: 0, component: COMPONENTS.NONE }))
            )
        );
    }
    dom.setInnerHTML("selected-object", "");
}
// リセットボタン
const clickResetHandler = () => {
    setPreviewObject(null)
    setSelectedObject(null, true)
    three.scene.traverse((child) => {
        if (child.userData.status) {
            setStatus(child, STATUS.INVISIBLE)
        }
    });
    componentData.length = 0
    for (let y=0; y<8; y++) {
        componentData.push(
            Array.from({ length: 8 }, () =>
                Array.from({ length: 8 }, ()=>({ tileNo: 0, component: COMPONENTS.NONE }))
            )
        );
    }
    selectedComponentData.length = 0
    for (let y=0; y<8; y++) {
        selectedComponentData.push(
            Array.from({ length: 8 }, () =>
                Array.from({ length: 8 }, ()=>({ tileNo: 0, component: COMPONENTS.NONE }))
            )
        );
    }
    // 1段目の柱のみプレビュー状態にする
    for (let x=0; x<8; x++) {
        for (let z=0; z<8; z++) {
            const found = three.scene.getObjectByName(`${COMPONENTS.SINGLE_PILLAR}#${x},0,${z}`);
            setStatus(found, STATUS.PREVIEW)
        }
    }
}

// プレビュー対象の切り替え
const changePreviewComponent = (component) => {
    setPreviewObject(null)
    three.scene.traverse((child) => {
        if (!child.userData.status) return
        if (child.userData.status === STATUS.SELECTED) return;
        if (child.userData.status === STATUS.CONFIRMED) return;
        setStatus(child, STATUS.INVISIBLE)
    });
    // テラスタイル
    if (component === COMPONENTS.TERRACE_TILE) {
        for (let x=0; x<8; x++) {
            for (let z=0; z<8; z++) {
                for (let y=1; y<8; y++) {
                    const target = componentData[y][x][z]
                    if (target.component !== COMPONENTS.NONE || target.tileNo > 0 || x == 7 || z == 7) continue;
                    
                    // 下の階に柱が３つなければスキップ
                    let pillarCount = 0;
                    if (componentData[y-1][x][z].component === COMPONENTS.SINGLE_PILLAR) pillarCount++;
                    if (componentData[y-1][x][z].component === COMPONENTS.DOUBLE_PILLAR) pillarCount++;
                    if (componentData[y-1][x+1][z].component === COMPONENTS.SINGLE_PILLAR) pillarCount++;
                    if (componentData[y-1][x+1][z].component === COMPONENTS.DOUBLE_PILLAR) pillarCount++;
                    if (componentData[y-1][x][z+1].component === COMPONENTS.SINGLE_PILLAR) pillarCount++;
                    if (componentData[y-1][x][z+1].component === COMPONENTS.DOUBLE_PILLAR) pillarCount++;
                    if (componentData[y-1][x+1][z+1].component === COMPONENTS.SINGLE_PILLAR) pillarCount++;
                    if (componentData[y-1][x+1][z+1].component === COMPONENTS.DOUBLE_PILLAR) pillarCount++;
                    if (pillarCount < 3) continue;

                    // 下に同一Noのテラスタイルがある場合スキップ
                    if (y > 1 && componentData[y-1][x][z].tileNo == componentData[y-1][x+1][z].tileNo && componentData[y-1][x+1][z].tileNo == componentData[y-1][x][z+1].tileNo) continue;

                    // 既存タイルがある場合スキップ
                    if (componentData[y][x+1][z].tileNo > 0) continue;
                    if (componentData[y][x][z+1].tileNo > 0) continue;
                    if (componentData[y][x+1][z+1].tileNo > 0) continue;

                    // オブジェクトを検索
                    const found = three.scene.getObjectByName(`${component}#${x},${y},${z}`);
                    if (!found) continue;
                    if (found.userData.status === STATUS.SELECTED) continue; // 選択中はスキップ
                    if (found.userData.status === STATUS.CONFIRMED) continue; // 確定済はスキップ
                    // プレビューとして設定
                    setStatus(found, STATUS.PREVIEW)
                }
            }
        }
    } else {
        // コンポーネント
        for (let x=0; x<8; x++) {
            for (let z=0; z<8; z++) {
                for (let y=0; y<8; y++) {
                    const target = componentData[y][x][z];
                    
                    // 最下層を除き、タイルがなければスキップ
                    if (y > 0 && target.tileNo === 0) continue; 

                    // 既存はスキップ
                    if (target.component !== COMPONENTS.NONE) continue;

                    // オブジェクトを検索
                    const found = three.scene.getObjectByName(`${component}#${x},${y},${z}`);
                    if (!found) continue
                    if (found.userData.status === STATUS.SELECTED) continue; // 選択中はスキップ
                    if (found.userData.status === STATUS.CONFIRMED) continue; // 確定済はスキップ
                    // オブジェクトを検索
                    setStatus(found, STATUS.PREVIEW)
                }
            }
        }
    }
}

