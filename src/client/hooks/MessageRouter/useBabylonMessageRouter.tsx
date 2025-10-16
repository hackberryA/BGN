import { useBabylonRoomData } from "../useBabylonRoomData";

export const useBabylonMessageRouter = () => { 
    const roomData = useBabylonRoomData();
    const send = (ws: WebSocket, type: string, roomId: string, data: any) => {
        switch (type) {
            // 部屋作成
            case "initRoom":
                // client
                roomData.new(roomId);
                // server
                ws.send(JSON.stringify({type: "initRoom"}))
                return;

        }
    }
    return [send]
    // // 再描画
    // if (data.type === "refresh") { 
    //     roomData(data); return; }

    // // 再接続
    // if (data.type === "reconnect") {
    // roomData.addLog(data.log);
    // return;
    // }

    // // 入室
    // if (data.type === "enter") {
    // roomData.addLog(data.log);
    // roomData.addPlayerInfo(data.userId, {userName: data.userName as string, status: "", meshMap: {}, tileMap: {}, });
    // return;
    // }

    // // 退室
    // if (data.type === "exit") {
    // roomData.addLog(data.log);
    // roomData.removePlayerInfo(data.userId);
    // return;
    // }
}