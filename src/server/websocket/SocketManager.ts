import { WebSocket, WebSocketServer } from "ws";
import { BabylonDataType } from "../types/BabylonTypes";
import { getCurrentTime } from "../utils/CommonUtils";
import { logger } from "../utils/logger";
import { handleBabylonMessage } from "./handler/BabylonMessageHandler";

export class SocketManager {
  private wss: WebSocketServer;
  private clients: { [roomId: string]: { [userId: string]: WebSocket } };
  public gamedata: { [roomId: string]: BabylonDataType };

  /** WebSocketServer コンストラクタ */
  constructor(server: any) {
    this.clients = {}
    this.gamedata = {}
    this.wss = new WebSocketServer({ server, path: "/ws" });
    this.wss.on("connection", (ws) => this.handleConnection(ws));
    logger.log(`🌐 WebSocket server started`);
  }

  /** 接続時設定 */
  private handleConnection(ws: WebSocket) {
    const clientInfo = {gameId: "", roomId: "", userId: "", userName: ""}

    ws.on("connect", ()=> logger.info("connect"))
    ws.on("error", (e)=> logger.error(e))

    // メッセージ受信
    ws.on("message", (raw) => {
      logger.log("####################################################################################################")
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
        if (this.gamedata[clientInfo.roomId]?.roomStatus === "waiting") {
          delete this.clients[clientInfo.roomId];
          logger.error(`[${clientInfo.roomId}] Delete room.`, this.clients[clientInfo.roomId]);
        } else {
          logger.warn(`[${clientInfo.roomId}] Not delete room playing`);
          if (this.gamedata[clientInfo.roomId]) {
            this.gamedata[clientInfo.roomId].userInfoMap[clientInfo.userId].online = false
          }
        }
      } else {
        // ログ
        const now = getCurrentTime();
        const roomLog = `${clientInfo.userName}さんはお星さまになりました。`;
        const roomLogInfo = {time: now, content: roomLog}
        this.gamedata[clientInfo.roomId].logs = [
          roomLogInfo,
          ...this.gamedata[clientInfo.roomId].logs,
        ]
        this.gamedata[clientInfo.roomId].userInfoMap[clientInfo.userId].online = false
        const patch = { logs: [roomLogInfo], userInfoMap: {[clientInfo.userId]: {online: false} }}
        this.broadcast(clientInfo.roomId, {patch})
      }
    });
  }

  // 特定クライアントに送信
  send(roomId: string, userId: string, mergeProps: MergeProps, type: string="refresh", writeLog: boolean=true) {
    if (writeLog) {
      // const userName = this.gamedata[roomId]?.userInfoMap[userId]?.userName;
      logger.logBabylonData(this.gamedata[roomId]);
    }
    const msg = JSON.stringify({type, ...mergeProps});
    const client = this.clients[roomId][userId];
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }

  // 参加者全員に送信
  broadcast(roomId: string, mergeProps: MergeProps, type: string="refresh", exceptId?: string) {
    if (!this.clients[roomId]) return;
    for (const userId of Object.keys(this.clients[roomId])) {
      if (userId === exceptId) continue;
      this.send(roomId, userId, mergeProps, type, false)
    }
  }

  // 部分的更新
  update(roomId: string, mergeProps: MergeProps) {
    if (this.gamedata[roomId]) mergeBabylonData({data: this.gamedata[roomId], ...mergeProps});
  };
}

// 再帰的Partial型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type MergeProps = {
  data?: BabylonDataType, 
  patch?: DeepPartial<BabylonDataType>,
  patchForAdd?: DeepPartial<BabylonDataType>,
  patchForRemove?: DeepPartial<BabylonDataType>
  patchForUpdate?: DeepPartial<BabylonDataType>
}

// Deep merge関数
function mergeBabylonData(props: MergeProps) {
  const {data: target, patch, patchForAdd, patchForRemove, patchForUpdate} = props
  if (target === undefined) return
  if (patch !== undefined) {
    // 上書き更新（log, chatはjoin）
    setValue(target, patch, "roomId");
    setValue(target, patch, "roomStatus");
    rightJoin(target, patch, "logs");
    leftJoin(target, patch, "chat");
    setValue(target, patch, "playerIndex");
    setValue(target, patch, "playerIds");
    setValue(target, patch, "phase");
    setValue(target, patch, "round");
    setValue(target, patch, "quarry");
    setValue(target, patch, "removeQuarry");
    // setValue(target, patch, "userInfoMap");
    setValue(target, patch, "playerInfoMap");
  }
  if (patchForAdd !== undefined) {
    logger.log("add playerIds:", patchForAdd.playerIds?.join(", "));
    // 追加
    leftJoin(target, patchForAdd, "playerIds");
    addItem(target, patchForAdd, "userInfoMap");
    addItem(target, patchForAdd, "playerInfoMap");
  }
  if (patchForRemove !== undefined) {
    // 削除
    logger.log("remove playerIds:", patchForRemove.playerIds?.join(", "));
    removeItem(target, patchForRemove, "playerIds");
    removeItem(target, patchForRemove, "quarry");
  }
  if (patchForUpdate !== undefined) {
    logger.log("[patchForUpdate]")
    logger.log(patchForUpdate)
    // 更新
    updateItem(target, patchForUpdate, "userInfoMap");
    updateItem(target, patchForUpdate, "playerInfoMap");
  }
}


// setValue: patchにキーが存在している場合、targetを更新する
const setValue = (target: any, patch: any, key: string) => {
  if (key in patch) target[key] = patch[key]
}
// leftJoin: patchにキーが存在＆配列の場合、target + patch
const leftJoin = (target: any, patch: any, key: string) => {
  if (key in patch && Array.isArray(patch[key])) target[key] = [...target[key], ...patch[key]]
}
// rightJoin: patchにキーが存在＆配列の場合、patch + target
const rightJoin = (target: any, patch: any, key: string) => {
  if (key in patch && Array.isArray(patch[key])) target[key] = [...patch[key], ...target[key]]
}
// addItem: オブジェクトに追加
const addItem = (target: any, patch: any, key: string) => {
  if (key in patch && isObject(patch[key])) target[key] = {...target[key], ...patch[key]};
}

// オブジェクト／配列から要素を削除
const removeItem = (target: any, patch: any, key: string) => {
  if (!(key in patch)) return;
  if (isObject(patch[key])) {
    // オブジェクト
    const pIds = new Set(patch[key].map((x:any) => x.id));
    target[key] = target[key].filter((x:any) => !pIds.has(x.id));
  } else if (Array.isArray(patch[key])) {
    // 配列
    const pSet = new Set(patch[key]);
    target[key] = target[key].filter((x:any) => !pSet.has(x));
  }
}
// オブジェクト／配列の要素（の要素）を更新
const updateItem = (target: any, patch: any, key: string) => {
  if (!(key in patch) || !isObject(patch[key])) return;
  Object.entries(patch[key]).forEach(([userId, value]: any)=>{
    // info(userInfo|playerInfo)の中身を更新
    target[key][userId] = { ...target[key][userId], ...value }
  });
}

export const isObject = (s: any) => {
  return s && typeof s === "object" && !Array.isArray(s) 
} 

