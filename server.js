const express = require("express");
const path = require("path");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイル (public フォルダの中)
app.use(express.static(path.join(__dirname, "public")));

// HTTPサーバー作成
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocketサーバー作成
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("received:", message.toString());
    ws.send(`echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
