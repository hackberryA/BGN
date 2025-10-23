import { NavigateFunction } from "react-router-dom";
import { RoomInfo, GameInfo, UserInfoMap, PlayerInfoMap } from "../types/BabylonTypes";
import { StorageType } from "../useStorage";

type Handlers = {
  navigate: NavigateFunction;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>;
  setGameInfo: React.Dispatch<React.SetStateAction<GameInfo>>;
  setUserInfoMap: React.Dispatch<React.SetStateAction<UserInfoMap>>;
  setPlayerInfoMap: React.Dispatch<React.SetStateAction<PlayerInfoMap>>;
};

export function handleSocketMessage(message: string, handlers: Handlers, storage: StorageType) {
    const { navigate, setRoomInfo, setGameInfo, setUserInfoMap, setPlayerInfoMap } = handlers;
    const { type, ...data } = JSON.parse(message);

    switch (type) {
        // 存在しない部屋IDにアクセスした場合、トップページに戻る
        case "goToHome":
            navigate("/");
            return;

        // F5等による再アクセス時、画面描画
        case "refresh":
            storage.setPreUserName(storage.userName);
            setRoomInfo(data.roomInfo);
            setGameInfo(data.gameInfo);
            setUserInfoMap(data.userInfoMap);
            setPlayerInfoMap(data.playerInfoMap);
            return;

        // アクセスユーザ通知＆データ更新
        case "notifyUserInfo":
            setUserInfoMap((prev) => ({...prev, [data.userId]: data.userInfo}));
            setRoomInfo((prev) => ({...prev, ...data.roomInfo, logs: [...data.roomInfo.logs, ...prev.logs]}));
            return;

        // 切断
        case "disconnect":
            setRoomInfo((prev) => ({...prev, logs: [data.roomLogInfo, ...prev.logs]})); // ログは前に追加
            // ユーザ情報を削除　※しない
            // setUserInfoMap((prev) => {
            //     const newMap = {...prev};
            //     delete newMap[data.userId];
            //     return newMap;
            // });
            setUserInfoMap((prev) => ({...prev, [data.userId]: {...prev[data.userId], online: false}}));
            return;

        // チャットを追加
        case "addChat":
            setRoomInfo((prev) => ({...prev, chat: [...prev.chat, data.chatData],})); // チャットは後ろに追加
            return;

        // ゲーム参加
        case "joinGame":
            setGameInfo((prev) => ({...prev, playerIds: data.playerIds}))
            setRoomInfo((prev) => ({...prev, logs: [data.roomLogInfo, ...prev.logs]}));
            return;

        // 参加取消
        case "notJoinGame":
            setGameInfo((prev) => ({...prev, playerIds: data.playerIds}))
            setRoomInfo((prev) => ({...prev, logs: [data.roomLogInfo, ...prev.logs]}));
            return;

        // 色選択
        case "selectUserColor":
            setUserInfoMap((prev) => ({...prev, [data.userId]: {...prev[data.userId], color: data.color}}))
            return;

        // ゲーム開始
        case "startGame":
            setGameInfo((prev) => ({...prev, ...data.gameInfo}))
            setRoomInfo((prev) => ({...prev, status: data.roomStatus, logs: [data.roomLogInfo, ...prev.logs]}));
            return;

    }
}
