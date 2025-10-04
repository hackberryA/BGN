// server.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

const roomData = {};
// roomData = {
//   "id": {
//       players: {userid, username},
//       ws: userid: ws
//       gamedata: {status, phase, round},
//     },
// }

const ROOM_ID_A = [
    "bump","null", "neko","choco", "mint", "ice", "berry", "sherbet", "rice", "potato", "tomato","tamago",
    "cat", "curry", "pig", "chicken", "beef", "lamb", "fire", "water", "thunder",
    "rapsody", "sonata", "blood", "light", "dark", "grey", "red", "yellow",
    "blue", "sky", "ocean", "mountain"
]
const ROOM_ID_B = ["of", "for", "and", "or","xor","nor", "is", "the", "to", "above", "beyond", "by"]
const DEFAULT_ROOM_DATA = { players: {}, ws: {}, gamedata: {} }
const DEFAULT_GAME_DATA = {
  round: 0,
  currentPlayerId: "",
  phase: 0, // 0: タイル選択中, 1: タイル配置中, 2: 確認待ち, 3: 確定
  playOrder: [],
  data: {
    userid: {
      tile:[], score:0, cards: []
    }
  }
}

// WebSocket 接続処理
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(message)
    const msgData = JSON.parse(message);
    const { roomId } = msgData;
    if (roomData[roomId]) {
      console.log(JSON.stringify(roomData[roomId].players));
    }
    console.log("server: " + msgData.type)
    //  setTestData
    if (msgData.type === "setTestData") {
      roomData["test"] = {testData: msgData.data}
    }
    // 再接続
    if (msgData.type === "reconnect") {
      if (!roomData[roomId]) {
        roomData[roomId] = { ...DEFAULT_ROOM_DATA };
      };
      ws.send(JSON.stringify({type: "reconnect", roomData: roomData[roomId]}));
    }
    // 部屋作成
    if (msgData.type === "createRoom") {
      roomId = ROOM_ID_A[Math.floor(Math.random() * ROOM_ID_A.length)];
      roomId += "-" + ROOM_ID_B[Math.floor(Math.random() * ROOM_ID_B.length)];
      roomId += "-" + ROOM_ID_A[Math.floor(Math.random() * ROOM_ID_A.length)];
      roomData[roomId] = { ...DEFAULT_ROOM_DATA };
      ws.send(JSON.stringify({ type: "roomCreated", roomId }));
    }
    // 参加・リネーム
    if (msgData.type === "joinRoom") {
      const { roomId, storageUserId, username } = msgData;
      if (!roomData[roomId]) {
        // 部屋データが見つからなければ再生成
        roomData[roomId] = { ...DEFAULT_ROOM_DATA };
        ws.send(JSON.stringify({ type: "roomCreated", roomId }));
      };
      // ユーザデータの有無を確認
      let userdata = roomData[roomId].players[storageUserId]
      if (!userdata) {
        // 新規
        console.log("新規:" + username)
        roomData[roomId].players[storageUserId] = {username};
      } else {
        // ユーザデータを更新
        console.log("更新:" + username)
        roomData[roomId].players[storageUserId].username = username;
      }
      roomData[roomId].ws[storageUserId] = ws;
      broadcast(roomId, {
        type: "playerList",
        players: Object.values(roomData[roomId].players).map((v) => v.username),
      })
    }

    // 行動
    if (msgData.type === "testAction") {
      const { roomId, userid, username } = msgData;
      if (!roomData[roomId]) return;
      broadcast(roomId, { type: "testAction", userid, username });
    }
  });

  ws.on("close", () => {
    // 切断処理（省略：本格運用ならここで roomData から削除する）
  });
});

function broadcast(roomId, msg) {
  console.log(`broadcast: ${roomId}, ${msg.type}`)
  Object.keys(roomData[roomId].players).forEach((k) => {
    console.log("k=" + k)
    const pws = roomData[roomId].ws[k]
    if (pws) {
      // console.log("msg=" + JSON.stringify(msg))
      pws.send(JSON.stringify(msg));
    } else {
      console.log("pws is undefined")
    }
  });
  // Object.keys(roomData[roomId].players).reduce((p) => {
  //   p.ws.send(JSON.stringify(msg));
  // });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
