import { SocketManager } from "./websocket/SocketManager";
import express from "express";
import http from "http";
// Express + HTTP サーバー
const app = express();
app.use(express.static("dist/client"));

const port = process.env.PORT || 8081;
const server = http.createServer(app);

// WebSocket を統合
const wsService = new SocketManager(server);

server.listen(port, () => {
  console.log(`HTTP server listening on http://localhost:${port}`);
});

// import express from 'express';
// import path from 'path';

// const app = express();
// const PORT = process.env.PORT || 3000;

// // 静的ファイル配信（フロントの webpack 出力）
// app.use(express.static(path.join(process.cwd(), 'dist/client')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(process.cwd(), 'dist/client/index.html'));
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));