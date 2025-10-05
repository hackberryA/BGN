import PlayerInfo from "../js/babylon/class/PlayerInfo.js";
import WebSocketFrontend from "../js/babylon/class/WebSocketFrontend.js"

// --------------------------------------------------
// Initialize
// --------------------------------------------------
// プレイヤー情報
const playerInfo = new PlayerInfo()

// WebSocket　
const ws = new WebSocketFrontend(playerInfo);

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

