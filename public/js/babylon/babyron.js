import * as THREE from "three";
import { initComponents } from './components.js';
import { COMPONENTS, componentWidth } from "./const.js";
import * as three from "./three.js";

export const componentData = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, ()=>({ tileNo: 0, component: COMPONENTS.NONE }))
    )
);

// GridHelper( size, divisions, colorCenterLine: Color, colorGrid :-Color-)
const gridHelper = new THREE.GridHelper(componentWidth * 8, 8, 0xEEEEEE, 0xEEEEEE);
three.scene.add(gridHelper);

//コンポーネント設定
initComponents()

// 描画
// setPreviewPoints()


const animate = () => {
    // // マウス位置からまっすぐに伸びる光線ベクトルを生成
    // three.raycaster.setFromCamera(three.mouse, three.camera);
    // const intersects = three.raycaster.intersectObjects(three.scene.children);
    // if (intersects.length > 0) {
    //     const intersectObject = intersects[0].object;
    //     // if (intersectObject.userData.selectable=== true) {
    //         if (hoverFocusObject) three.scene.remove(hoverFocusObject);
    //         hoverFocusObject = setFocus(intersectObject)
    //         three.scene.add(hoverFocusObject);
    //     // }
    //     if (hoverFocusObject) {
    //         three.scene.remove(hoverFocusObject);
    //         hoverFocusObject = null;
    //     }
    //     three.controls.update();

    // }
    // レンダリング
    requestAnimationFrame(animate);
    three.renderer.render(three.scene, three.camera);
}
animate()

// リサイズ対応
window.addEventListener('resize', () => three.renderer.setSize(three.canvasWidth, three.canvasWidth));
