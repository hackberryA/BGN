import { WebSocketServer } from "ws";
import { SocketManager } from "./websocket/SocketManager";

new SocketManager();

const wss = new WebSocketServer({ port: 8080 });
