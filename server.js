const express = require("express");
const path = require("path");
const { WebSocketServer } = require("ws");
const { gameState, handleMessage, removePlayer } = require("./game");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const playerId = Date.now();
  gameState.players[playerId] = { x: 0, y: 0 };

  ws.send(JSON.stringify({ type: "init", state: gameState }));

  ws.on("message", (msg) => handleMessage(ws, msg, playerId, wss));

  ws.on("close", () => removePlayer(playerId, wss));
});
