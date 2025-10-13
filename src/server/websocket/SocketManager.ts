import { WebSocketServer, WebSocket } from "ws";
import { ENV } from "../config/env";
import { logger } from "../utils/logger";
import { MessageRouter } from "./MessageRouter";
import { ClientMessage, ServerMessage } from "./types";

export class SocketManager {
  private wss: WebSocketServer;
  private clients = new Map<string, WebSocket>();
  private router: MessageRouter;

  constructor() {
    this.wss = new WebSocketServer({ port: ENV.PORT });
    this.router = new MessageRouter(this);

    this.wss.on("connection", (ws) => this.handleConnection(ws));

    logger.info(`🌐 WebSocket server started on ws://localhost:${ENV.PORT}`);
  }

  private handleConnection(ws: WebSocket) {
    const id = Math.random().toString(36).slice(2, 9);
    this.clients.set(id, ws);

    logger.info(`✅ Client connected: ${id}`);

    ws.on("message", (raw) => {
        this.router.handleMessage(id, JSON.parse(raw.toString()) as ClientMessage);
    });

    ws.on("close", () => {
      this.clients.delete(id);
      logger.info(`❌ Client disconnected: ${id}`);
    });
  }

  send(clientId: string, message: ServerMessage) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  broadcast(message: ServerMessage) {
    const msg = JSON.stringify(message);
    for (const ws of this.clients.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
      }
    }
  }
}
