import { SocketManager } from "./websocket/SocketManager";

new SocketManager();

import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイル配信（フロントの webpack 出力）
app.use(express.static(path.join(process.cwd(), 'dist/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist/client/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));