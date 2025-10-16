import { WebSocketServer, WebSocket } from "ws";
import { ENV } from "../config/env";
import { logger } from "../utils/logger";
import { BabylonMessageRouter } from "./BabylonMessageRouter";
import { ClientMessage, ServerMessage } from "./types";

export class SocketManager {
  private wss: WebSocketServer;
  private clients = new Map<string, WebSocket>();
  private router: BabylonMessageRouter;

  constructor() {
    this.wss = new WebSocketServer({ port: ENV.PORT });
    this.router = new BabylonMessageRouter(this);

    this.wss.on("connection", (ws) => this.handleConnection(ws));

    logger.info(`🌐 WebSocket server started on ws://localhost:${ENV.PORT}`);
  }

  private handleConnection(ws: WebSocket) {
    const clientId = Math.random().toString(36).slice(2, 9);
    this.clients.set(clientId, ws);

    logger.info(`✅ Client connected: ${clientId}`);

    ws.on("message", (raw) => {
        const {game, roomId, type, ...other} = JSON.parse(raw.toString());
        switch (game) {
          case "babylon":
            this.router.handleBabylonMessage(clientId, roomId, other);
            return;
      }
    });

    ws.on("close", () => {
      this.clients.delete(clientId);
      logger.info(`❌ Client disconnected: ${clientId}`);
    });
  }

  send(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  broadcast(message: any) {
    const msg = JSON.stringify(message);
    for (const ws of this.clients.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
      }
    }
  }
}
