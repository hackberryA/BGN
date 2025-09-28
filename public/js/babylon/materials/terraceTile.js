
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
