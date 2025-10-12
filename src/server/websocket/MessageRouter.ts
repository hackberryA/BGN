import { ClientMessage } from "./types";
import { SocketManager } from "./SocketManager";
import { logger } from "../utils/logger";

export class MessageRouter {
  constructor(private socketManager: SocketManager) {}

  handleMessage(clientId: string, msg: ClientMessage) {
    switch (msg.type) {
      case "ping":
        this.socketManager.send(clientId, { type: "pong" });
        break;

      case "join":
        logger.info(`🧑 Client ${clientId} joined the game`);
        break;

      default:
        logger.warn(`Unknown message type: ${msg.type}`);
    }
  }
}
