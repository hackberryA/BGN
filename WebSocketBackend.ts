import * as WebSocket from "ws";

/**
 * バックエンド用 WebSocket操作クラス
 */
export default class WebSocketBackend {
    /** 訪問者 (id: name) */
    visitorList: Map<string, string>;
    /** プレイヤー (id: name) */
    playerList: Map<string, string>;
    /** クライアントごとのWebSocket (id: ws) */
    clients: Map<string, WebSocket.Server>;

    /**
     * コンストラクタ
     */
    constructor(wss: WebSocket.Server) {
        this.visitorList = new Map(); // 訪問者
        this.playerList = new Map(); // プレイヤー
        this.clients = new Map(); // id: ws

        // --------------------------------------------------
        wss.on('connection', (ws: WebSocket.Server) => {
            // 接続設定
            console.log("server WebSocket connected.")

            const clientId = crypto.randomUUID();
            this.clients.set(clientId, ws);
            console.log(`接続: ${clientId}（現在${this.clients.size}人）`);

            // クライアントに自分のIDを送信
            this.sendMessage("connected", { id: clientId });
            ws.send(JSON.stringify({ type: 'assignId', id: clientId }));

            // メッセージ受信設定
            this.setMessageHandler(ws, "");

            // クライアントとの接続が切断された時の処理
            ws.on('close', () => {
                this.clients.delete(clientId);
                console.log(`Disconnected: ${clientId}`);
            });
        });
    }

    /**
     * メッセージ受信ハンドラ登録
     * @param {*} type 
     * @param {*} callback 
     */
    setMessageHandler = (ws, type, callback) => {
        ws.on("message", (message) => {
            const data = JSON.parse(message);
            if (data.type === type) callback(data) ;
        });
    }
    
    /** データ送信 */
    sendMessage = (type, data = {}) => { 
        this.clients.forEach((ws) =>ws.send(JSON.stringify({ roomId: this.roomId, type: type, ...data })))
    }
}
