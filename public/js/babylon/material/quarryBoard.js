

// --------------------------------------------------
// 採掘場ボード
// --------------------------------------------------
export const quarry = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 10, width *.10),
    new THREE.MeshStandardMaterial({ color: 0xFFFAFF })
);
quarry.rotation.x= -Math.PI /2;
quarry.position.y = -1


