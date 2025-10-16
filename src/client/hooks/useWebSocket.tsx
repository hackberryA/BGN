import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { generateUUID } from "three/src/math/MathUtils";
import { useBabylonMessageRouter } from "./MessageRouter/useBabylonMessageRouter";
import io, { Socket } from "socket.io-client";
import { USERID, USERNAME } from "../const/const";

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [sendBabylonMessage] = useBabylonMessageRouter()
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");
    socketRef.current = ws;

    /** 初回接続時 */
    ws.onopen = () => {
      // プレイ中のユーザでなければ null 想定
      const userId = localStorage.getItem(USERID)
      const userName = localStorage.getItem(USERNAME)
      // 新規接続
      if (!userId) { localStorage.setItem(USERID, generateUUID()) }
      ws.send(JSON.stringify({ type: "reconnect", userId, userName }));
    };

    /** メッセージ受信 */
    ws.onmessage = (msg) => {
      const {game, roomId, type, ...other} = JSON.parse(msg.data);
      console.log(`Received: [${game}, ${type}] ${other}`);
      switch (game) {
        case "babylon": sendBabylonMessage(ws, type, roomId, other); return;
      }

    };

    /** 切断時 */
    ws.onclose = () => {console.log("Disconnected");}

    return () => ws.close();
  }, []);

  const send = (data: any) => {
    console.log("send message:", data)
    // if (userId) data.playerId = userId; // 送信時にID付与
    socketRef.current?.send(JSON.stringify(data));
  };
  return { socket: socketRef.current, send };
}

type SocketContextType = {
  send: (data: any) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

type SocketProviderType = {game: string, roomId: string, children: ReactNode}
export function SocketProvider({ game, roomId, children }: SocketProviderType) {
  return <SocketContext.Provider value={{ send }}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocketContext must be used within SocketProvider");
  return context;
}
