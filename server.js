// server.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

// app.get("/room/:roomId", (_, res) => {
//   res.sendFile(__dirname + "/public/room.html");
// });
const rooms = {}; // { roomId: { players: [], turnIndex: 0 } }

const ROOM_IDS = {
    "0":"bump", "1":"of", "2":"for", "3":"and", "4":"or","5":"xor","6":"nor", "7":"is", "8":"null", "9":"neko",
    "a":"choco", "b":"mint", "c":"ice", "d":"berry", "e":"sherbet", "f":"rice", "g":"potato", "h":"tomato","i":"tamago",
    "j":"cat", "k":"curry", "l":"pig", "m":"chicken", "n":"beef", "o":"lamb", "p":"fire", "q":"water", "r":"thunder",
    "s":"rapsody", "t":"sonata", "u":"blood", "v":"light", "w":"dark", "x":"grey", "y":"red", "z":"yellow",
    "@":"blue", "?":"sky", "!":"ocean", "#":"mountain"
}


// WebSocket 接続処理
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "createRoom") {
      const id = uuidv4().slice(0, 3);
      roomId = ROOM_IDS[id.slice(0, 1)]
      roomId += "-" + ROOM_IDS[id.slice(1, 2)]
      roomId += "-" + ROOM_IDS[id.slice(2, 3)]
      rooms[roomId] = { players: [], turnIndex: 0 };
      ws.send(JSON.stringify({ type: "roomCreated", roomId }));
    }

    if (data.type === "joinRoom") {
      const { roomId, userName } = data;
      if (!rooms[roomId]) return;

      rooms[roomId].players.push({ name: userName, ws });
      broadcast(roomId, {
        type: "playerList",
        players: rooms[roomId].players.map((p) => p.name),
      });
    }

    if (data.type === "play") {
      const { roomId, move, userName } = data;
      if (!rooms[roomId]) return;
      broadcast(roomId, { type: "move", move, userName });
      // ターン制ならここで turnIndex 更新とか
    }
  });

  ws.on("close", () => {
    // 切断処理（省略：本格運用ならここで rooms から削除する）
  });
});

function broadcast(roomId, msg) {
  rooms[roomId].players.forEach((p) => {
    p.ws.send(JSON.stringify(msg));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
