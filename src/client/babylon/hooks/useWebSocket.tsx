import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  // ローカルストレージに保存されているIDを取得
  const [playerId, setPlayerId] = useState<string | null>(localStorage.getItem("playerId"));

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected");
      // 接続時にサーバーに既存のplayerIdを送信
      ws.send(JSON.stringify({ type: "reconnect", playerId }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      console.log("Received:", data);

      if (data.type === "connected") {
        setPlayerId(data.id);
        localStorage.setItem("playerId", data.id); // 保存
      }
    };

    ws.onclose = () => console.log("Disconnected");

    return () => ws.close();
  }, [url, playerId]);

  const send = (data: any) => {
    if (playerId) data.playerId = playerId; // 送信時にID付与
    socketRef.current?.send(JSON.stringify(data));
  };

  return { socket: socketRef.current, send, playerId };
}

type SocketContextType = {
  send: (data: any) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ url, children }: { url: string; children: ReactNode }) {
  const { send } = useWebSocket(url);
  return <SocketContext.Provider value={{ send }}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocketContext must be used within SocketProvider");
  return context;
}