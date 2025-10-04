/**
 * WebSocket (フロントエンド)
 */
export default class WebSocketFrontEnd {
    /**
     * コンストラクタ
     */
    constructor() {
        const protocol = (location.host == "127.0.0.1:5500") ? "ws" : "wss";
        this.ws = new WebSocket(`${protocol}://${location.host}`);
        console.log(this.ws)
        this.data = {}
        this.ws.onopen = () => {
            console.log("接続が確立しました！");
            ws.send("サーバーさん、こんにちは！");
        }
        
        // WebSocket メッセージ受信時の処理
        this.ws.onmessage = (msg) => {
            const msgData = JSON.parse(msg.data);

            if (msgData.type === "reconnect") {
                if (msgData.roomData) {
                console.log(msgData)
                const list = document.getElementById("playerList");
                list.innerHTML = "";
                Object.values(msgData.roomData.players).forEach((v) => {
                    const li = document.createElement("li");
                    li.textContent = v.username;
                    list.appendChild(li);
                })
                }
            }
            if (msgData.type === "playerList") {
                console.log("client: " + msgData.players)
                const list = document.getElementById("playerList");
                list.innerHTML = "";
                Object.values(msgData.players).forEach((v) => {
                const li = document.createElement("li");
                li.textContent = v;
                list.appendChild(li);
                })
            }

            if (msgData.type === "testAction") {
                const log = document.getElementById("log");
                log.innerHTML += `<p>${msgData.userid}: ${msgData.username}</p>`;
            }
        };
        
        this.ws.onclose = () => {
            log("closed")
        }
    }

    /** データ送信 */
    send = (type, data = {}) => { 
        this.ws.send(JSON.stringify({ roomId: this.roomId, type: type, ...data })) 
    }
    
    // メッセージ送信をラップする新しいsendメソッド
    wait = function (type, data, callback) {
        // 接続が確立するまで待機する関数を呼び出す
        this.waitForConnection(function () {
            this.ws.send(JSON.stringify({ roomId: this.roomId, type: type, ...data })) 
            if (typeof callback !== 'undefined') {
            callback();
            }
        }, 1000); // 1秒ごとにチェック
    };

    // 接続状態をチェックし、確立されるまで待機する関数
    waitForConnection = function (callback, interval) {
        // readyStateが1 (OPEN) なら、コールバックを実行
        if (ws.readyState === 1) {
            callback();
        } else {
            var that = this;
            // そうでなければ、指定された間隔で再試行する
            // オプション：ここでインターバルのバックオフ（間隔を徐々に長くする）を実装することもできます
            // English: optional: implement backoff for interval here
            setTimeout(function () {
                that.waitForConnection(callback, interval);
            }, interval);
        }
    };

    // サーバーに識別情報を送信するidentメソッド
    ident = function () {
        var session = "Test";
        // 新しいsendメソッドを使い、送信後の処理をコールバックとして渡す
        this.send(session, function () {
            window.identified = true;
            theText.value = "Hello!";
            say.click();
            theText.disabled = false;
        });
    };
}
