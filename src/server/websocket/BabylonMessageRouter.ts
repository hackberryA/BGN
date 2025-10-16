import { ClientMessage } from "./types";
import { SocketManager } from "./SocketManager";
import { logger } from "../utils/logger";
import { roomData } from "../babylon/RoomData";

export class BabylonMessageRouter {
  constructor(private socketManager: SocketManager) {}

  handleBabylonMessage(clientId: string, roomId: string, data: any) {
    logger.info(data);
    const state = roomData.getState()
    switch (data.type) {
      case "initRoom":
        // 接続者にデータを送る
        this.socketManager.send(clientId, {type: "refresh", ...getRoomData()});

        // ゲーム参加中のプレイヤーの場合、再接続通知を送る
        if (state.getPlayerInfo(data.userId)) {
          const log = `[${now()}] ${data.userName} が再接続しました。`
          state.addLog(log);
          this.socketManager.broadcast({ type: "reconnect", log: log});
        }
        break;

      // 入室
      case "enter":
        logger.info(`🧑 Client ${data.userId} enter the room`);
        logger.debug(state.getPlayerInfo(data.userId))
        if (!state.getPlayerInfo(data.userId)) {
          const log = `[${now()}] ${data.userName} が参加しました`;
          logger.info(log);
          state.addLog(log)
          state.addPlayerInfo(data.userId, { userName: data.userName, status: "", meshMap: {}, tileMap: {} })
          this.socketManager.broadcast({ type: "enter", userId: data.userId, userName: data.userName, log: log});
        }
        break;
      // 退室
      case "exit":
          const info = state.getPlayerInfo(data.userId)
          if (info) {
            const log = `[${now()}] ${info.userName} が退室しました`;
            logger.info(log);
            state.addLog(log)
            state.removePlayerInfo(data.userId)
            this.socketManager.broadcast({ type: "exit", userId: data.userId, userName: data.userName, log: log});
          }
          break;

      // default:
      //   logger.warn(`Unknown message type: ${msg.type}`);
    }
  }
}

const now = () => {
  const d = new Date();
  const mm = String(d.getHours()).padStart(2, "0");
  const dd = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${mm}:${dd}:${ss}`;
}