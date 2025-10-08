// import PlayerInfo from "../js/babylon/class/PlayerInfo.js";
// import WebSocketFrontend from "../js/babylon/class/WebSocketFrontend.js"
// import {setup} from "../js/babylon/babylon.js"
import Board from "../js/babylon/class/Board.js";
import Component from "../js/babylon/class/Component.js";
import { grid, playerBoard } from "../js/babylon/material/playerBoard.js";
import COMPONENT_TYPE from "../js/babylon/const/componentType.js";
// --------------------------------------------------
// Initialize
// --------------------------------------------------
// プレイヤー情報
// const playerInfo = new PlayerInfo()

// WebSocket　
// const ws = new WebSocketFrontend(playerInfo);

// setup()
const board = new Board("id", "name", 1)
board.animate()
board.append(grid)
board.append(playerBoard)

board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 1, 0, 1).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 1, 0, 2).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 2, 0, 1).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 2, 0, 2).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 1, 1, 1).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 1, 1, 2).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 2, 1, 1).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 2, 1, 2).mesh)
board.append(new Component(COMPONENT_TYPE.STAIR, 2, 1, 1).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 2, 1, 2).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 2, 0, 3).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 1, 0, 3).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 2, 1, 3).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 1, 1, 3).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 1, 1, 2).mesh)
board.append(new Component(COMPONENT_TYPE.SINGLE_PILLAR, 2, 1, 2).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 1, 2, 2).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 2, 2, 2).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 2, 2, 3).mesh)
board.append(new Component(COMPONENT_TYPE.TERRACE_TILE, 1, 2, 3).mesh)

// // room id　　　　
// const params = new URLSearchParams(location.search);
// const roomId = params.get("r");
// // room data
// let roomData = {roomdId: roomId}

// import * as storage from '../js/utils/storage.js';

// // --------------------------------------------------
// // intialize
// // --------------------------------------------------
// dom.setInnerText("roomId", `Room ID: ${roomId}`);
// dom.setValue("username", storage.getUsername());

// storage.initialize();
// websocket.initialize();

// // event.initialize();
// // selectComponent.initialize();

