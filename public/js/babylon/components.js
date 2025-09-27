import * as quarry from "./materials/quarry.js";
import * as table from "./materials/playerBoard.js";
import * as three from './three.js';

// 初期設定
export const initComponents = () => {
    three.scene.add(quarry.create())
    three.scene.add(table.create())
    // for (let floor = 1; floor <= 3; floor++) {
    //   for (let idx = 1; idx <= 16; idx++) {
    //     const row = idx % 4 - 1.5;
    //     const col = Math.ceil(idx / 4) - 2.5;
    
    //     scene.add(createQuarryCardMesh (floor, row, col))
    //   }
    // }
}
