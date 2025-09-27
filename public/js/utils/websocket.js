// --------------------------------------------------
// WebSocket 
// --------------------------------------------------
// 送信
export const send = (type, data = {}) => {
    ws.send(JSON.stringify({
        roomId: roomId,
        type: type,
        ...data
    }))
}

// --------------------------------------------------
// 初期処理
// --------------------------------------------------
export const initialize = () => {
    // 開始時の処理
    ws.onopen = () => send("reconnect");
    
    // WebSocket メッセージ受信時の処理
    ws.onmessage = (msg) => {
        const msgData = JSON.parse(msg.data);
        console.log("client: " + msgData.type)

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
}

