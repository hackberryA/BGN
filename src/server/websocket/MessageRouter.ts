import { ClientMessage } from "./types";
import { SocketManager } from "./SocketManager";
import { logger } from "../utils/logger";

export class MessageRouter {
  constructor(private socketManager: SocketManager) {}

  handleMessage(clientId: string, msg: ClientMessage) {
    switch (msg.type) {
      case "reconnect":
        if (msg.playerId && data.playerIds.includes(msg.playerId)) {
          // 既存
          console.log(`Player reconnected with ID: ${msg.playerId}`);
          this.socketManager.send(clientId, { type: "connect", clientId: clientId });
        } else {
          // 新規
          console.log(`New player connected: ${clientId}`);
          this.socketManager.send(clientId, { type: "connect",  clientId: clientId });
        }
        break;

      case "join":
        logger.info(`🧑 Client ${clientId} joined the game`);
        break;

      case "log":
        logger.info("log", msg.log);
          this.socketManager.broadcast({ type: "log", log: "servertest" });
        break;


      default:
        logger.warn(`Unknown message type: ${msg.type}`);
    }
  }
}
