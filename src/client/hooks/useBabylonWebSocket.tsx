import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSocketMessage } from "./handler/handleBabylonMessage";
import { GameInfo, PlayerInfoMap, RoomInfo, ScoketContextType, UserInfoMap } from "./types/BabylonTypes";
import { useStorage } from "./useStorage";

/** ルーム情報 - デフォルト値 */
const defaultRoomInfo: RoomInfo = {roomId: "", status: "waiting", logs: [], chat: []};
/** ゲーム情報 - デフォルト値 */
const defaultGameInfo: GameInfo = {playerIndex: 0, playerIds: [], phase: "waiting", round: 0};
/** Context - デフォルト値 */
const defaultContextValue: ScoketContextType = {
  ws: null, send: () => {}, userInfoMap: {}, playerInfoMap: {},
  roomInfo: defaultRoomInfo, gameInfo: defaultGameInfo,
  userLength: 0, playerLength: 0,
}
const ScoketContext = createContext<ScoketContextType>(defaultContextValue);
export const useBabylonWebSocket = () => useContext(ScoketContext);

type Props = { roomId: string; children: React.ReactNode };
export const SocketProvider: React.FC<Props> = ({ roomId, children}) => {
  const storage = useStorage()
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const socketRef = useRef<WebSocket|null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(defaultRoomInfo);
  const [userInfoMap, setUserInfoMap] = useState<UserInfoMap>({})
  const [gameInfo, setGameInfo] = useState<GameInfo>(defaultGameInfo)
  const [playerInfoMap, setPlayerInfoMap] = useState<PlayerInfoMap>({})
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8081/ws/room/${roomId}`);
    socketRef.current = ws;

    //////////////////////////////////////////////////
    // 接続時
    ws.onopen = () => {
      if (storage.userName) {
        // クライアント情報を設定
        ws.send(JSON.stringify({
          gameId: "babylon",
          roomId,
          messageType: "connect",
          userId: storage.userId,
          userName: storage.userName,
          data: {
            color: storage.userColor,
            preUserName: storage.preUserName,
            auth: storage.auth === "true",
          },
        }));
      } else {
        navigate("/")
      }
    };
    //////////////////////////////////////////////////
    // 受信設定
    ws.onmessage = (e) => handleSocketMessage(e.data, { navigate, setRoomInfo, setGameInfo, setUserInfoMap, setPlayerInfoMap }, storage);

    //////////////////////////////////////////////////
    ws.onclose = () => { };
    ws.onerror = () => console.log(`Socket error)`);
    setSocket(ws);
    return () => ws.close();
  }, [roomId]);

  //////////////////////////////////////////////////
  // メッセージ送信
  const send = (messageType: string, data: any={}) => {
    if(!socket) {
      console.log("socket is null")
      return;
    }
    // console.log(data);
    socket.send(JSON.stringify({
      gameId: "babylon",
      roomId: roomId,
      messageType: messageType,
      userId: storage.userId,
      userName: storage.userName,
      data: data,
    }));
  };

  //////////////////////////////////////////////////
  const values = {
    ws: socket, send, roomInfo, gameInfo, userInfoMap, playerInfoMap,
    userLength: Object.keys(userInfoMap).length,
    playerLength: gameInfo.playerIds.length,
  }
  return <ScoketContext.Provider value={values}>{children}</ScoketContext.Provider>
}
