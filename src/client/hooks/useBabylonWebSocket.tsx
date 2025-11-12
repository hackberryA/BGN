import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BabylonDataType, defaultBabylonData, PlayerInfoType, UserInfoType } from "../types/BabylonTypes";
import { useStorage } from "./useStorage";

type ScoketContextType = {
  send: (messageType: string, data?: any) => void;
  data: BabylonDataType;
  userLength: number;
  playerLength: number;
  isLoading: boolean;
  userInfo: UserInfoType;
  playerInfo: PlayerInfoType | undefined;
  currentPlayerInfo: PlayerInfoType | undefined;
  isPlayer: boolean;
  isTurnPlayer: boolean;
  isQuarryPhase: boolean;
  isBuildingPhase: boolean;
}
const defaultUserInfo: UserInfoType = {
    userName: "ゲスト",
    color: "blue",
    icon: "default",
    logs: [],
    auth: false,
    online: true,
}
const defaultContextValue: ScoketContextType = { 
  send: () => {},
  data: defaultBabylonData,
  userLength:0,
  playerLength: 0,
  isLoading: true,
  userInfo: defaultUserInfo,
  playerInfo: undefined,
  currentPlayerInfo: undefined,
  isPlayer: false,
  isTurnPlayer: false,
  isQuarryPhase: false,
  isBuildingPhase: false,
}
const ScoketContext = createContext<ScoketContextType>(defaultContextValue);
export const useBabylonWebSocket = () => useContext(ScoketContext);

type Props = { roomId: string; children: React.ReactNode };
export const SocketProvider: React.FC<Props> = ({ roomId, children}) => {
  const navigate = useNavigate();
  const storage = useStorage()
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const socketRef = useRef<WebSocket|null>(null);
  const [data, setData] = useState<BabylonDataType>(defaultBabylonData)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'ws' : 'ws';
    const host = window.location.protocol === 'https:' ? window.location.host : "localhost:8081";
    // const protocol = 'wss';
    // const host = window.location.host; // ポートも含まれる
    const url = `${protocol}://${host}/ws/${roomId}` 
    // const url = `${protocol}://${host}` 
    console.log(url)
    const ws = new WebSocket(url);
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
            icon: storage.userIcon,
            preUserName: storage.preUserName,
            auth: storage.auth,
          },
        }));
        storage.setPreUserName(storage.userName)
      } else {
        navigate("/")
      }
    };
    //////////////////////////////////////////////////
    // 受信設定
    // ws.onmessage = (e) => handleSocketMessage({message: e.data, storage, navigate, update});
    ws.onmessage = (e) => {
        setIsLoading(false)
        const { type, data, patch, patchForAdd, patchForRemove, patchForUpdate } = JSON.parse(e.data);
        
        switch (type) {
            // 存在しない部屋IDにアクセスした場合、トップページに戻る
            case "goToHome":
                navigate("/");
                return;

            // 描画
            case "refresh":
                if (data) {
                  setData(data);
                } else {
                  setData(prev => mergeBabylonData({data: prev, patch, patchForAdd, patchForRemove, patchForUpdate}));
                }
        };
      }

    //////////////////////////////////////////////////
    ws.onclose = () => { };
    ws.onerror = (e) => console.log(`(Socket error?)`, e);
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
    socket.send(JSON.stringify({
      gameId: "babylon",
      roomId: roomId,
      messageType: messageType,
      userId: storage.userId,
      userName: storage.userName,
      data: data,
    }));
  };
  const isPlayer = data.playerIds.includes(storage.userId)

  //////////////////////////////////////////////////
  const values = {
    send,
    data,
    userLength: data?.userInfoMap ? Object.keys(data.userInfoMap).length : 0,
    playerLength: data.playerIds.length,
    isLoading,
    userInfo: data.userInfoMap[storage.userId] ?? defaultUserInfo,
    playerInfo: data.playerIds.length == 0 ? undefined : isPlayer ? data.playerInfoMap[storage.userId] : data.playerInfoMap[data.playerIds[0]],
    currentPlayerInfo: data.playerInfoMap[data.playerIds[data.playerIndex]],
    isPlayer: isPlayer,
    isTurnPlayer: data.playerIds.length > 0 && (storage.userId === data.playerIds[data.playerIndex]),
    isQuarryPhase: data.phase === "quarry",
    isBuildingPhase: data.phase === "building",
  }
  return <ScoketContext.Provider value={values}>{children}</ScoketContext.Provider>
}

// 再帰的Partial型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type MergeProps = {
  data: BabylonDataType, 
  patch: DeepPartial<BabylonDataType>,
  patchForAdd: DeepPartial<BabylonDataType>,
  patchForRemove: DeepPartial<BabylonDataType>
  patchForUpdate: DeepPartial<BabylonDataType>
}

// Deep merge関数
export function mergeBabylonData(props: MergeProps) {
  const {data: prev, patch, patchForAdd, patchForRemove, patchForUpdate} = props
  const target = {...prev}

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
    // 追加
    leftJoin(target, patchForAdd, "playerIds");
    addItem(target, patchForAdd, "userInfoMap");
    addItem(target, patchForAdd, "playerInfoMap");
  }
  if (patchForRemove !== undefined) {
    // 削除
    removeItem(target, patchForRemove, "playerIds");
    removeItem(target, patchForRemove, "quarry");
  }
  if (patchForUpdate !== undefined) {
    // 更新
    updateItem(target, patchForUpdate, "userInfoMap");
    updateItem(target, patchForUpdate, "playerInfoMap");
  }
  return target
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

