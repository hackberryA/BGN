import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AUTH_KEY, NAME_COLOR_LIST, PREUSERNAME_KEY, USERCOLOR_KEY, USERID_KEY, USERNAME_KEY } from "../const/const";
import { GameInfo, PlayerInfoMap, RoomInfo, ScoketContextType, UserInfoMap } from "./types/BabylonTypes";
import { useNavigate } from "react-router-dom";
import { handleSocketMessage } from "./handler/handleBabylonMessage";

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
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const socketRef = useRef<WebSocket|null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(defaultRoomInfo);
  const [userInfoMap, setUserInfoMap] = useState<UserInfoMap>({})
  const [gameInfo, setGameInfo] = useState<GameInfo>(defaultGameInfo)
  const [playerInfoMap, setPlayerInfoMap] = useState<PlayerInfoMap>({})
  const localUserId = localStorage.getItem(USERID_KEY) || "";
  const localUserName = localStorage.getItem(USERNAME_KEY) || "";
  const localPreUserName = localStorage.getItem(PREUSERNAME_KEY) || "";
  const localAuth = localStorage.getItem(AUTH_KEY) || "false";
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8081/ws/room/${roomId}`);
    socketRef.current = ws;

    //////////////////////////////////////////////////
    // 接続時
    ws.onopen = () => {
      const color = localStorage.getItem(USERCOLOR_KEY) || NAME_COLOR_LIST[Math.floor(Math.random() * (NAME_COLOR_LIST.length))]
      localStorage.setItem(USERCOLOR_KEY, color)
      if (localUserName) {
        // クライアント情報を設定
        ws.send(JSON.stringify({
          gameId: "babylon",
          roomId,
          messageType: "connect",
          userId: localUserId,
          userName: localUserName,
          data: {color: color, preUserName: localPreUserName, auth: localAuth === "true"},
        }));
      } else {
        navigate("/")
      }
    };
    //////////////////////////////////////////////////
    // 受信設定
    ws.onmessage = (e) => handleSocketMessage(e.data, { navigate, setRoomInfo, setGameInfo, setUserInfoMap, setPlayerInfoMap });

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
      userId: localStorage.getItem(USERID_KEY),
      userName: localStorage.getItem(USERNAME_KEY),
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
