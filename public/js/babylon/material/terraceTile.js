// @ts-check
import * as THREE from "three";
import COMPONENT_TYPE from "../const/componentType.js";
import { height, width } from "../const/material.js";

// --------------------------------------------------
// テラスタイル
// --------------------------------------------------
export const terraceTile = new THREE.Mesh(
    new THREE.BoxGeometry(width, height / 20, width),
    new THREE.MeshStandardMaterial({color: 0x00FAFA})
);

terraceTile.userData.component = COMPONENT_TYPE.TERRACE_TILE;
