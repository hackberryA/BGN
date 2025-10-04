// @ts-check
import * as THREE from "three";
import * as componentType from "../../babylon/const/componentType.js";
import { height, width } from "../const/material.js";

// --------------------------------------------------
// テラスタイル
// --------------------------------------------------
export const terraceTile = new THREE.Mesh(
    new THREE.BoxGeometry(width, height / 20, width),
    new THREE.MeshStandardMaterial({color: 0x00FAFA})
);

terraceTile.userData.component = componentType.TERRACE_TILE;
