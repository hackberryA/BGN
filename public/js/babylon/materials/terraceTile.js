import { componentHeight, componentWidth, defaultMaterial, COMPONENTS, defaultData } from "../const.js";
import * as THREE from "three";
import { getPosition } from "./common.js";

const width = componentWidth * 2
const colors = {1: 0xEEEEEE, 2: 0xEECCCC, 3: 0xCCCCCC}
const spacing = componentHeight / 10
// 採掘場配置用
export const createQuarryCardMesh =(floor, row, col) => {
    const card = new THREE.Mesh(
        new THREE.PlaneGeometry (width, width),
        new THREE.MeshStandardMaterial({ color: colors [floor], side: THREE.DoubleSide })
    );
    // データ
    card.userData = {
        ...defaultMaterial,
        component: COMPONENTS.TERRACE_TILE,
        selectable: floor === 1,
        floor: floor,
        row: row,
        col: col,
    }
    // カードの位置
    card.position.x = row * (width * 1.1) + Math.random() * width / 100;
    card.position.z = col * (width * 1.1) + Math.random() * width / 100;
    card.position.y = spacing * 4 - floor * spacing;

    // 傾き
    card.rotation.x = -Math.PI / 2;
    card.rotation.z = (Math.random() - .5) / 5;
    return card
}

const geometry = new THREE.BoxGeometry (componentWidth, componentHeight / 20, componentWidth);
const cell = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x00FAFA}));
cell.position.set(0, 0, 0);

// Terrace Tiles
export const create = (x,y,z,r=0) => {
    const {px, py, pz} = getPosition(x,y,z);
    const c1 = cell.clone()
    const c2 = cell.clone()
    c2.position.x = componentWidth
    const c3 = cell.clone()
    c3.position.z = componentWidth
    const c4 = cell.clone()
    c4.position.x = componentWidth
    c4.position.z = componentWidth
    const tile = new THREE.Group();
    tile.add(c1, c2, c3,c4)
    tile.position.x = px;
    tile.position.y = py;
    tile.position.z = pz;
    tile.userData = {...defaultData, component: COMPONENTS.TERRACE_TILE}
    return tile
}