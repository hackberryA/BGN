import { setText } from 'common';
import { initComponents } from 'components';
import { componentWidth } from "../const.js";
import { createPillar } from 'materials/pillar';
import { createStair } from 'materials/stair';
import { getCursorPos, setFocus } from 'mouseevent';
import { camera, canvas, canvasWidth, controls, mouse, raycaster, renderer, scene } from 'setup';
import * as THREE from "three";
import { createTerraceTile } from 'materials/tiles';
// import { createFountain } from 'materials/fountain'

// GridHelper( size, divisions, colorCenterLine: Color, colorGrid :-Color-)
const gridHelper = new THREE.GridHelper(componentWidth * 8, 8, 0xEEEEEE, 0xEEEEEE);
scene.add(gridHelper);

//コンポーネント設定
initComponents(scene)

// const pillarMeshes = [];
// const pillarBodies = [];
// for (let i=0; i<-148; i++) {
//     const [pillar, cbody] = randomPillar()
//     scene.add(pillar);
//     pillarMeshes.push(pillar);
//     world.addBody (cbody);
//     pillarBodies.push(cbody);
// }

scene.add(createStair(0,0,-1,0))
scene.add(createPillar(0,0,1))
scene.add(createPillar (1,0,1))
scene.add(createPillar (1,0,0))
scene.add(createPillar (1,1,1))
scene.add(createPillar (-1,0,1))
scene.add(createPillar (-1,1,1))
scene.add(createStair (0,1,1,3)) 
scene.add(createPillar (-2,0,1))
scene.add(createPillar (-2,1,1))
scene.add(createPillar (-2,0,0))
scene.add(createPillar (-2,1,0))
scene.add(createTerraceTile (-1,0,0))
scene.add(createTerraceTile (0,1,0))
scene.add(createTerraceTile(-2,1,0))
scene.add(createTerraceTile(-2,2,0))
// scene.add(createFountain (0,1,0))

let selectedObject = null;
let selectedFocusObject = null;
let hoverFocusObject=null; //マウスオーバー時のフォーカスオブジェクト

// 描画
// 選択中のオブジェクトへのフォーカス設定

// マウス移動イベントハンドラ
canvas.addEventListener('mousemove', (e) => {
    const {x, y, canvasX, canvasY} = getCursorPos(e)
    mouse.x = x;
    mouse.y = y;
    setText("canvas-pos", `(${canvasX}, ${canvasY})`) 
    setText("mouse-pos", `(${x.toFixed(3)}, ${y.toFixed(3)})`)
});

// マウスクリックイベントハンドラ
canvas.addEventListener('click', (e) => {
    // 座標を取得
    const {x, y} = getCursorPos(e)
    setText("click-pos", `(${x.toFixed(3)}, -${y.toFixed(3)})`)

    //・フォーカスを削除
    if (selectedFocusObject) scene.remove(selectedFocusObject);
    
    // 選択オブジェクト
    const intersects = raycaster.intersectObjects (scene.children);
    if (intersects.length > 0) {
        // 選択中のオブジェクトを保持 (解除時にuserDataを書き換えるため)
        selectedObject = intersects[0].object;
        if (selectedObject.userData.selectable === true) {
            selectedObject.userData.selected = true
            selectedFocusObject = setFocus(selectedObject)
            setText("selected", selectedObject.userData.component)
            setText("info", JSON.stringify(selectedObject.userData))
        }
    } else {
        if (selectedObject) selectedObject.userData.selected = false
        selectedFocusObject = null;
        setText("selected","")
    }
});

const animate = () => {
    // レイキャスト=マウス位置からまっすぐに伸びる光線ベクトルを生成 raycaster.setFromCamera (mouse, camera);
    const intersects =raycaster.intersectObjects (scene.children);
    if (intersects.length > 0) {
    const intersectObject = intersects[0].object;
        if (intersectObject.userData.selectable=== true) {
            if (hoverFocusObject) scene.remove(hoverFocusObject);
            hoverFocusObject = setFocus(intersectObject)
            scene.add(hoverFocusObject);
        }
        
        if (hoverFocusObject) {
            scene.remove(hoverFocusObject);
            hoverFocusObject = null;
        }
        controls.update();

        // レンダリング
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}
animate()

// リサイズ対応
window.addEventListener('resize', () => renderer.setSize(canvasWidth, canvasWidth));