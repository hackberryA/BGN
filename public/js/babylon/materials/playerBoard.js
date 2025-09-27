
import { componentWidth, defaultData, COMPONENTS } from "../const.js";
import * as THREE from "three";

// 盤面
const TABLE_WIDTH = componentWidth * 12;
const TABLE_COLOR = 0xAAFAFF;
const table = new THREE.Mesh(
    new THREE.PlaneGeometry (TABLE_WIDTH, TABLE_WIDTH),
    new THREE.MeshStandardMaterial({ color: TABLE_COLOR })
);
table.position.y = -1;
table.rotation.x = -Math.PI / 2;
table.name = "player-board"
table.userData = {...defaultData, component: COMPONENTS.PLAYER_BOARD}

// オブジェクト作成
export const create = () => {
    return table
}
