import { grid, playerBoard } from './material/playerBoard.js';
import { initMapInfo } from './material.js';
import * as three from "./three.js";
import FLOWER from './const/flower.js';
import Board from './class/Board.js';

const boardList = new Map()
const flower = [...FLOWER]
/**
 * ゲーム開始
 * @param  {...any} playerInfo 
 */
// export const setup = (...playerInfo) => {
export const setup = () => {
    // プレイヤー設定
    // for (const {playerId, playerName} of playerInfo) {
    //     // 盤面設定
    //     const board = new Board({ playerId, playerName, flower: randomFlower() })
    //     board.animate()
    //     boardList.set(playerId, board);
    // }

    

    // // three.js 設定
    three.setup();

    // //コンポーネント設定
    // append(playerBoard)
    // append(grid)
    three.initMapInfo();

    // // render
    three.animate()
}

randomFlower = () => {
    if (flower.length === 0) return undefined;
    const index = Math.floor(Math.random() * flower.length);
    return flower.splice(index, 1)[0];
}

