import WebSocketFrontEnd from "../js/babylon/class/WebSocketFrontEnd.js"
import dom from '../js/babylon/utils/dom.js';

// --------------------------------------------------
// Initialize
// --------------------------------------------------
// WebSocket　
const ws = new WebSocketFrontEnd();

// ボタンイベント登録
dom.setOnclick("joinGame", () => {
    const playerName = dom.getValue("playerName")
    ws.send("joinGame", {playerName})
})

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

