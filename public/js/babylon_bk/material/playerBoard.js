// @ts-check
import * as THREE from "three";
import * as componentType from "../const/componentType.js";
import { width } from "../const/material.js";

// --------------------------------------------------
// プレイヤーボード
// --------------------------------------------------
// export const playerBoard = new THREE.Group()

// GridHelper( size, divisions, colorCenterLine: Color, colorGrid :-Color-)
export const grid = new THREE.GridHelper(width * 8, 8, 0xEEEEEE, 0xEEEEEE);

export const playerBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 12, width * 12),
    new THREE.MeshStandardMaterial({ color: 0xaafaff })
);
playerBoard.position.y = -1;
playerBoard.rotation.x = -Math.PI / 2;

// playerBoard.add(playerBoard, grid)
playerBoard.name = "playerBoard"
playerBoard.userData = { component: componentType.PLAYER_BOARD }

