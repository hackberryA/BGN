import * as THREE from "three";

export const defaultMaterialParameters = {
    color: 0xffffaa,
    roughness:.3,
    metalness:.1,
    flatShading: true,
    normalScale: new THREE.Vector2(2, 2),
} as THREE.MeshStandardMaterialParameters

export const commonShadow = {
    castShadow: true,
    receiveShadow: true,
}