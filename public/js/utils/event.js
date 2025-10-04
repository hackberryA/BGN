import * as dom from '../babylon/utils/dom.js';
import * as storage from './storage.js';

// --------------------------------------------------
// イベント
// --------------------------------------------------
export const initialize = () => {
    // 参加ボタン押下処理
    dom.setOnclick("joinBtn", () => {
        const username = dom.getValue("username");
        if (!username) return;

        storage.getUsername(username)
        ws.send(JSON.stringify({
            type: "joinRoom",
            roomId: roomId,
            userid: storage.getUserid(),
            username: username,
        }));
    });

    // 開始ボタン
    dom.setOnclick("testActionBtn", () => {
        storage.userid = localStorage.getItem(STORAGE_USER_ID);
        storage.username = localStorage.getItem(STORAGE_USER_NAME);
        ws.send(JSON.stringify({ type: "testAction", roomId, userid: storage.userid, username:storage.username }));
    });

    // 【デバッグ用】 ローカルストレージ削除
    dom.setOnclick("deleteStorage", storage.removeStroage);

    // 【デバッグ用】テストデータを送信
    dom.setOnclick("setTestData", () => ws.send(JSON.stringify({ type: "setTestData", roomId, data: "testData" })));
}



