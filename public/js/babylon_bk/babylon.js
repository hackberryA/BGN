import { grid, playerBoard } from './material/playerBoard.js';
import { initMapInfo } from './material.js';
import { animate, append, setup } from "./three.js";

export const main = () => {
    // three.js 設定
    setup();

    //コンポーネント設定
    append(playerBoard)
    append(grid)
    initMapInfo();

    // render
    animate()
}

