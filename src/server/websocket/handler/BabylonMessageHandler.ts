import { BabylonDataType } from "../../types/BabylonTypes";
import { getCuurrentTime } from "../../utils/StringUtils";
import { logger } from "../../utils/logger";
import { SocketManager } from "../SocketManager"; // 逆参照

type BabylonMessage = {
  roomId: string;
  messageType: string;
  userId: string;
  userName: string;
  data: any;
};

/**
 * Babylon用メッセージ処理
 * @param socketManager SocketManagerインスタンス（send/broadcastにアクセス）
 * @param msg 受信メッセージ
 */
export function handleBabylonMessage(socketManager: SocketManager, msg: BabylonMessage) {
  const { roomId, messageType, userId, userName, data } = msg;

  // ------------------------------------------------------------
  // 新規部屋作成
  // ------------------------------------------------------------
  if (!socketManager.gamedata[roomId] && messageType === "connect") {
    // 作成者じゃない場合は帰宅
    if (!data.auth) {
      socketManager.send(roomId, userId, { type: "goToHome" });
      return;
    }
    // ログ
    const now = getCuurrentTime();
    const roomLog = `${userName}さんが入室しました。`;
    const clientLog = `Welcome! ${userName}`;
    logger.info(`[babylon][${roomId}][${userName}]`, roomLog);

    // ユーザ情報
    const userInfo = { userName, color: data.color || "blue", logs: [{ time: now, content: clientLog }], auth: data.auth, online: true };
    
    // 部屋情報
    const roomLogInfo = { time: now, content: roomLog };
    const roomInfo = { roomId, status: "waiting", logs: [roomLogInfo], chat: [] };

    // ゲームデータ新規作成
    socketManager.gamedata[roomId] = {
      roomInfo: roomInfo,
      gameInfo: { playerIndex: 0, playerIds: [], phase: "waiting", round: 0 },
      userInfoMap: { [userId]: userInfo },
      playerInfoMap: {},
    };

    // データ送信
    socketManager.broadcast(roomId, { type: "notifyUserInfo", userId, userInfo, roomInfo });
    socketManager.send(roomId, userId, { type: "refresh", ...socketManager.gamedata[roomId] });
    return;
  }

  // ------------------------------------------------------------
  // 既存部屋に対する処理
  // ------------------------------------------------------------
  const gameData = socketManager.gamedata[roomId] as BabylonDataType | undefined;
  if (!gameData) return; // 無効な部屋なら無視

  switch (messageType) {
    // アクセスユーザにデータ送信＆全体ユーザ通知
    case "connect": {
      const now = getCuurrentTime();
      const changedName = data.preUserName && data.preUserName !== userName;
      const roomLog = changedName
        ? `${userName}(${data.preUserName})さんが入室しました。`
        : `${userName}さんが入室しました。`;
      const clientLog = `Welcome! ${userName}`;
      // ユーザ情報
      if (userId in gameData.userInfoMap) {
        // 既存の場合
        gameData.userInfoMap[userId].userName = userName;
        gameData.userInfoMap[userId].online = true;
      } else {
        // 新規
        const userInfo = {
          userName,
          color: data.color || "blue",
          logs: [{ time: now, content: clientLog }],
          auth: data.auth,
          online: true,
        };
        gameData.userInfoMap[userId] = userInfo;
      }
      // 部屋情報
      const roomLogInfo = { time: now, content: roomLog };
      gameData.roomInfo.logs.unshift(roomLogInfo);

      socketManager.broadcast(roomId, {
        type: "notifyUserInfo", userId, userInfo: gameData.userInfoMap[userId], 
        roomInfo: gameData.roomInfo
      });
      socketManager.send(roomId, userId, { type: "refresh", ...gameData });
      return;
    }

    // チャットを追加
    case "addChat": {
      const now = getCuurrentTime();
      const chatData = { time: now, userName, content: data.content };
      gameData.roomInfo.chat.push(chatData);
      socketManager.broadcast(roomId, { type: "addChat", chatData });
      return;
    }

    // ゲーム参加
    case "joinGame": {
      if (gameData.gameInfo.playerIds.includes(userId)) return;
      if (gameData.gameInfo.playerIds.length >= 4) return;
      gameData.gameInfo.playerIds.push(userId)
      const roomLogInfo = { time: getCuurrentTime(), content: `${userName}さんがゲームに参加しました。` }
      gameData.roomInfo.logs.unshift(roomLogInfo);
      socketManager.broadcast(roomId, { type: "joinGame", roomLogInfo, playerIds: gameData.gameInfo.playerIds });
      return;
    }

    // 参加取消
    case "notJoinGame": {
      if (!gameData.gameInfo.playerIds.includes(userId)) return;

      // 破壊
      const index = gameData.gameInfo.playerIds.indexOf(userId);
      if (index !== -1) gameData.gameInfo.playerIds.splice(index, 1);

      const roomLogInfo = { time: getCuurrentTime(), content: `${userName}さんが参加を取り消しました。` }
      gameData.roomInfo.logs.unshift(roomLogInfo);
      socketManager.broadcast(roomId, { type: "notJoinGame", roomLogInfo, playerIds: gameData.gameInfo.playerIds });
      return;
    }

    // 色選択
    case "selectUserColor": {
      gameData.userInfoMap[userId].color = data.color;
      socketManager.broadcast(roomId, { type: "selectUserColor", userId, color: data.color });
      return;
    }

    // ゲーム開始
    case "startGame": {
      // ステータスを変更
      // プレイヤー順をランダムに決定する。
      const playerIds = gameData.gameInfo.playerIds;
      for (let i = playerIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0〜iのランダムな整数
        [playerIds[i], playerIds[j]] = [playerIds[j], playerIds[i]]; // 要素を入れ替える
      }

      const roomLogInfo = { time: getCuurrentTime(), content: "ゲームを開始します。" }
      gameData.roomInfo.logs.unshift(roomLogInfo);
      gameData.roomInfo.status = "progress"
      gameData.gameInfo = {...gameData.gameInfo, playerIds, phase: playerIds.length < 4 ? "setup" : "quarry"};
      socketManager.broadcast(roomId, {
        type: "startGame",
        roomLogInfo,
        roomStatus: "progress",
        gameInfo: gameData.gameInfo,
      });
      return
    }
  }
}
