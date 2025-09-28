import * as THREE from "three";
import { componentColor, componentHeight, COMPONENTS, componentWidth } from "./const.js";
import { RoundedBoxGeometry } from 'RoundedBoxGeometry';

// 共通マテリアル
const defaultMaterial = new THREE.MeshStandardMaterial({ color: componentColor });

// 当たり判定
const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(componentWidth, 1, componentWidth),
    new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.1}),
);
hitBox.position.y = 0;
hitBox.userData.isHitBox = true

// --------------------------------------------------
// プレイヤーボード
// --------------------------------------------------
const tableWidth = componentWidth * 12;
const tableColor = 0xAAFAFF;
export const playerBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(tableWidth, tableWidth),
    new THREE.MeshStandardMaterial({ color: tableColor })
);
playerBoard.position.y = -1;
playerBoard.rotation.x = -Math.PI / 2;
playerBoard.name = "playerBoard"
playerBoard.userData = {
    component: COMPONENTS.PLAYER_BOARD
}

// --------------------------------------------------
// 採掘場ボード
// --------------------------------------------------
export const quarry = new THREE.Mesh(
    new THREE.PlaneGeometry(componentWidth * 10, componentWidth *.10),
    new THREE.MeshStandardMaterial({ color: 0xFFFAFF })
);
quarry.rotation.x= -Math.PI /2;
quarry.position.y = -1

// --------------------------------------------------
// テラスタイル
// --------------------------------------------------

const terraceTileGeometry = new THREE.BoxGeometry(componentWidth, componentHeight / 20, componentWidth);
const teracceTilecell = new THREE.Mesh(terraceTileGeometry, new THREE.MeshStandardMaterial({color: 0x00FAFA}));
teracceTilecell.position.set(0, -2, 0);

// Terrace Tiles
const c1 = teracceTilecell.clone()
const c2 = teracceTilecell.clone()
c2.position.x = componentWidth
const c3 = teracceTilecell.clone()
c3.position.z = componentWidth
const c4 = teracceTilecell.clone()
c4.position.x = componentWidth
c4.position.z = componentWidth
export const terraceTile = new THREE.Group();
terraceTile.add(c1, c2, c3,c4)



// --------------------------------------------------
// シングル柱
// --------------------------------------------------
const pillarWidth = componentWidth * 0.5;
const pillarHeight = componentHeight * 0.85

// ̇柱身 CylinderGeometry(radiusTop, radius Bottom, height)
const shaftGeometry= new THREE.CylinderGeometry(pillarWidth / 4, pillarWidth/4, pillarHeight, 12); 
const shaft = new THREE.Mesh(shaftGeometry, defaultMaterial);
shaft.position.y = pillarHeight / 2;

// 柱頭 RoundedBoxGeometry(幅, 高さ, 奥行, セグメント数, 角の半径)
const capital = new THREE.Mesh(
    new RoundedBoxGeometry(pillarWidth, pillarHeight / 6, pillarWidth, 2, 1),
    defaultMaterial
);

// 柱基
const base = capital.clone()
capital.position.y = pillarHeight * 11 / 12;
base.position.y = 0;

//グループ化
export const pillar = new THREE.Group();
pillar.add(shaft, capital, base, hitBox);

// debug y
// const ygeometry = new THREE.BoxGeometry(0.1, componentHeight * 10, 0.1);
// const ystep = new THREE.Mesh(ygeometry, new THREE.MeshStandardMaterial({color: 0xFF0000}));
// pillar.add(ystep)


// --------------------------------------------------
// 階段
// --------------------------------------------------
export const stair = new THREE.Group();
const steps = 10; // 段数
const stepwidth= componentWidth / 15
const stepHeight = componentHeight / 10
const stepMaterial = new THREE.MeshStandardMaterial({color: componentColor});
for (let i = 1; i <= steps; i++) {
    const geometry = new THREE.BoxGeometry(componentWidth / 2, stepHeight * i, stepwidth);
    const step = new THREE.Mesh(geometry, stepMaterial);
    step.position.set(.0, stepHeight / 2 * i, stepwidth * (i-3));
    stair.add(step);
}
const geometry = new THREE.BoxGeometry(componentWidth / 2, stepHeight / 2, componentWidth / 1.34);
const step = new THREE.Mesh(geometry, stepMaterial);
step.position.set(0, componentHeight, stepwidth * 13);
stair.add(step);


// --------------------------------------------------
// 噴水
// --------------------------------------------------



