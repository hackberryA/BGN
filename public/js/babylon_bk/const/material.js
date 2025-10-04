
import * as THREE from "three";

export const unit = (n) => n;

export const width = unit(20);
export const height = unit(16);
export const color = 0xffffaa
export const defaultMaterial = new THREE.MeshStandardMaterial({ color: color });
export const BOARD_SIZE = 8;
export const MAX_LAYER= 5;

export const getHitBox = () => {

    // 当たり判定
    const hitBox = new THREE.Mesh( 
        new THREE.BoxGeometry(width, unit(1), width), 
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.1}) 
    );
    hitBox.position.y = 0;
    hitBox.userData.isHitBox = true;
    return hitBox
}