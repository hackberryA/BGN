import dom from "../utils/dom.ts"
import UserInfo from './PlayerInfo.js';

/**
 * クライアント                  サーバー
 *     |                          |
 *     |                          |
 *     | ---[connect]-----------> | 新規接続
 *     | <----------[UserList]--- |   ユーザリスト表示切替
 *     | <-----------[refresh]--- |   （ゲーム中の場合）ゲーム画面の再描画
 *     |                          |
 *     | ---[joinGame]----------> | プレイヤー参加・キャンセル
 *     | <----------[UserList]--- |   ユーザリスト表示切替
 *     |                          |
 *     | ---[ready]-------------> | 準備切替
 *     | <-------------[ready]--- |   表示切替
 *     |                          |
 *     | ---[startGame]---------> | ゲーム開始
 *     |                          |   クライアント側は表示のみで、サーバー側でゲームデータを整形する
 *     | <-----------[refresh]--- |   画面描画
 *     |                          |
 *     | Game Start               |
 *     |                          |  
 *     | ---[getTile]-----------> | 
 */


/** 送信メッセージタイプ */
const SEND_TYPE = {
    CONNECT: "connect",
    JOINGAME: "joinGame",
    READY: "ready",
    STARTGAME: "startGame",
}
/** 受信メッセージタイプ */
const RECEIVE_TYPE = {
    USERLIST: "UserList",
    READY: "ready",
    REFRESH: "refresh", // ゲームデータ受信・画面描画は全てこれ
}

/**
 * WebSocket (フロントエンド)
 */
export default class WebSocketFrontend {
    /** ユーザ情報 */
    userInfo: {id: string, name: string};
    /** WebSocket */
    ws: WebSocket;
    /** 各プレイヤーのゲームデータ */
    playerData: Map<string, {}>;
    
    /**
     * コンストラクタ
     */
    constructor(userInfo: UserInfo) {
        this.userInfo = { id: userInfo.id, name: userInfo.name };
        if (location.host == "127.0.0.1:5500") {
            this.ws = new WebSocket(`ws://localhost:8080`);
        } else {
            this.ws = new WebSocket(`wss://${location.host}`);
        }
        this.playerData = new Map();
        // 接続時
        this.ws.onopen = () => {
            console.log("WebSocket connected.");
            this.send("connect", { playerId: userInfo.id, playerName: userInfo.name });
        }

        // メッセージ受信設定
        this.setMessageHandler("connected", this.connectedHandler);

        this.ws.onmessage = (msg) => {
            console.log("Received message: " + msg);
            // onmessageHandler(JSON.parse(msg));
        }
        // 終了時
        this.ws.onclose = () => { console.log("closed.") }
    }

    /** データ送信 */
    send = (type, data = {}) => { 
        const message = JSON.stringify({ roomId: this.roomId, type: type, ...data });
        console.log("Send message: " + message);
        this.ws.send(message);
    }
   
    /**
     * メッセージ受信ハンドラ登録
     * @param {*} type 
     * @param {*} callback 
     */
    setMessageHandler = (type, callback) => {
        this.ws.on("message", (message) => {
            const data = JSON.parse(message);
            if (data.type === type) callback(data) ;
        });
    }
    /** メッセージ受信ハンドラ */
    connectedHandler = (data) => {
        this.userInfo.setUserId(data.id)
    }

    // onmessageHandler = (data) => {
    //     if (data.type === "reconnect") {
    //         if (data.roomData) {
    //         console.log(data)
    //         const list = document.getElementById("playerList");
    //         list.innerHTML = "";
    //         Object.values(data.roomData.players).forEach((v) => {
    //             const li = document.createElement("li");
    //             li.textContent = v.username;
    //             list.appendChild(li);
    //         })
    //         }
    //     }
    //     if (data.type === "playerList") {
    //         console.log("client: " + data.players)
    //         const list = document.getElementById("playerList");
    //         list.innerHTML = "";
    //         Object.values(data.players).forEach((v) => {
    //             const li = document.createElement("li");
    //             li.textContent = v;
    //             list.appendChild(li);
    //         })
    //     }

    //     if (data.type === "testAction") {
    //         const log = document.getElementById("log");
    //         log.innerHTML += `<p>${data.userid}: ${data.username}</p>`;
    //     }
    // }

        // // ボタンイベント登録
        // dom.setOnclick("joinGame", () => {
        //     const playerName = dom.getValue("playerName");
        //     this.send("joinGame", {playerName});
        // })

    // // メッセージ送信をラップする新しいsendメソッド
    // wait = function (type, data, callback) {
    //     // 接続が確立するまで待機する関数を呼び出す
    //     this.waitForConnection(function () {
    //         this.ws.send(JSON.stringify({ roomId: this.roomId, type: type, ...data })) 
    //         if (typeof callback !== 'undefined') {
    //         callback();
    //         }
    //     }, 1000); // 1秒ごとにチェック
    // };

    // // 接続状態をチェックし、確立されるまで待機する関数
    // waitForConnection = function (callback, interval) {
    //     // readyStateが1 (OPEN) なら、コールバックを実行
    //     if (ws.readyState === 1) {
    //         callback();
    //     } else {
    //         var that = this;
    //         // そうでなければ、指定された間隔で再試行する
    //         // オプション：ここでインターバルのバックオフ（間隔を徐々に長くする）を実装することもできます
    //         // English: optional: implement backoff for interval here
    //         setTimeout(function () {
    //             that.waitForConnection(callback, interval);
    //         }, interval);
    //     }
    // };

    // // サーバーに識別情報を送信するidentメソッド
    // ident = function () {
    //     var session = "Test";
    //     // 新しいsendメソッドを使い、送信後の処理をコールバックとして渡す
    //     this.send(session, function () {
    //         window.identified = true;
    //         theText.value = "Hello!";
    //         say.click();
    //         theText.disabled = false;
    //     });
    // };
}
