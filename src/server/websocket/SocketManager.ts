import { WebSocket, WebSocketServer } from "ws";
import { ENV } from "../config/env";
import { logger } from "../utils/logger";
import { getCuurrentTime } from "../utils/StringUtils";
import { handleBabylonMessage } from "./handler/BabylonMessageHandler";

export class SocketManager {
  private wss: WebSocketServer;
  private clients: { [roomId: string]: { [userId: string]: WebSocket } };
  public gamedata: { [roomId: string]: any };

  /** WebSocketServer コンストラクタ */
  constructor() {
    this.wss = new WebSocketServer({ port: ENV.PORT });
    this.clients = {}
    this.gamedata = {}
    this.wss.on("connection", (ws) => this.handleConnection(ws));
    console.log(`🌐 WebSocket server started on ws://localhost:${ENV.PORT}`);
  }

  /** 接続時設定 */
  private handleConnection(ws: WebSocket) {
    const clientInfo = {gameId: "", roomId: "", userId: "", userName: ""}

    // メッセージ受信
    ws.on("message", (raw) => {
      logger.log("##################################################")
      logger.info("[Client Info]", clientInfo);
      logger.info("[Receive Message]", raw.toString());
      const {gameId, roomId, messageType, userId, userName, data} = JSON.parse(raw.toString());
      logger.log("--------------------------------------------------")

      // 部屋データ初期化
      if (!(roomId in this.clients)) {
        this.clients[roomId] = {};
        logger.info(`[${gameId}][${roomId}][${userName}] Initialize room data`)
      }

      // ユーザデータ初期化
      if (!(userId in this.clients[roomId])) {
        clientInfo.gameId = gameId;
        clientInfo.roomId = roomId;
        clientInfo.userId = userId;
        clientInfo.userName = userName;
        this.clients[roomId][userId] = ws;
        logger.info(`[${gameId}][${roomId}][${userName}] Initialize user data`)
      }

      // ゲームごとに処理を振分け
      switch (gameId) {
        case "babylon":
          // handleBabylonMessage({roomId, messageType, userId, userName, data});
          handleBabylonMessage(this, { roomId, messageType, userId, userName, data });
          return;
      }
    });

    // 切断時
    ws.on("close", () => {
      logger.log("##################################################")
      logger.info("[close]", clientInfo)
      if (!clientInfo) return;
      if (!this.clients[clientInfo.roomId]) return;

      // 部屋データからクライアントを除去
      delete this.clients[clientInfo.roomId][clientInfo.userId];
      // const index = this.gamedata[clientInfo.roomId].gameInfo.playerIds.indexOf(clientInfo.userId);
      // if (index !== -1) this.gamedata[clientInfo.roomId].gameInfo.playerIds.splice(index, 1);


      logger.error(`[${clientInfo.roomId}][${clientInfo.userId}] Client disconnected.`);
      // 空になった場合、部屋データを削除
      if (Object.keys(this.clients[clientInfo.roomId]).length === 0) {
        if (this.gamedata[clientInfo.roomId]?.roomInfo.status === "waiting") {
          delete this.clients[clientInfo.roomId];
          logger.error(`[${clientInfo.roomId}] Delete room.`, this.clients[clientInfo.roomId]);
        } else {
          logger.warn(`[${clientInfo.roomId}] Not delete room playing`);
          this.gamedata[clientInfo.roomId].userInfoMap[clientInfo.userId].online = false
        }
      } else {
        // ログ
        const now = getCuurrentTime();
        const roomLog = `${clientInfo.userName}さんはお星さまになりました。`;
        const roomLogInfo = {time: now, content: roomLog}
        this.gamedata[clientInfo.roomId].roomInfo.logs = [
          roomLogInfo,
          ...this.gamedata[clientInfo.roomId].roomInfo.logs,
        ]
        this.gamedata[clientInfo.roomId].userInfoMap[clientInfo.userId].online = false
        this.broadcast(clientInfo.roomId, {
          type: "disconnect",
          roomLogInfo,
          userId: clientInfo.userId,
        })
      }
    });
  }

  // 特定クライアントに送信
  send(roomId: string, userId: string, message: any, consoleLog: boolean=true) {
    if (consoleLog) {
      const userName = this.gamedata[roomId]?.userInfoMap[userId]?.userName;
      logger.info(
        `[Send Message ${userName}]`,
        JSON.stringify({roomId, ...message})
      );
    }
    const data = JSON.stringify(message);
    const client = this.clients[roomId][userId];
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }

  // 参加者全員に送信
  broadcast(roomId: string, message: any, exceptId?: string) {
    if (!this.clients[roomId]) return;
    logger.info("[Broadcast]", JSON.stringify({roomId, ...message}))
    for (const userId of Object.keys(this.clients[roomId])) {
      if (userId === exceptId) continue;
      this.send(roomId, userId, message, false)
    }
  }
}
