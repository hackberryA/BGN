import { FlowerType } from "../../const/babylon/flowers";
import { SymbolType } from "../../const/babylon/symbols";
import { BabylonDataType, ComponentType } from "../../types/BabylonTypes";
import { confirmComponent, getLog, getPlacableDecoration, getPlacableTiles, initData, initPlayerInfo, initUserInfo, removeQuarryTile, resetPreviewPillars, setNextPlayerInfo } from "../../utils/BabylonUtils";
import { getCurrentTime, randInt, shuffleArray } from "../../utils/CommonUtils";
import { logger } from "../../utils/logger";
import { getRandomQuarry, popRandom } from "../../utils/QuarryUtils";
import { DeepPartial, SocketManager } from "../SocketManager"; // 逆参照

type BabylonMessage = {
    roomId: string;
    messageType: string;
    userId: string;
    userName: string;
    data: any;
};
const MAX_PILLAR = 6;

/**
 * Babylon用メッセージ処理
 * @param socketManager SocketManagerインスタンス（send/broadcastにアクセス）
 * @param msg 受信メッセージ
 */
export function handleBabylonMessage(socketManager: SocketManager, msg: BabylonMessage) {
    const { roomId, messageType, userId, userName, data: msgData } = msg;

    // ------------------------------------------------------------
    // 新規部屋作成
    // ------------------------------------------------------------
    if (!socketManager.gamedata[roomId] && messageType === "connect") {
        logger.info(`[babylon][${roomId}][${userName}] New room. (${msgData.auth})`);
        // 作成者じゃない場合は帰宅
        if (!msgData.auth) {
            socketManager.send(roomId, userId, {}, "goToHome");
            return;
        }
        const data = initData({roomId, userId, userName, color: msgData.color, icon: msgData.icon})

        // 更新差分
        socketManager.gamedata[roomId] = data;

        // データ送信
        // socketManager.broadcast(roomId, { type: "notifyUserInfo", data: patch });
        socketManager.send(roomId, userId, {data})
        return;
    }

    // ------------------------------------------------------------
    // 既存部屋に対する処理
    // ------------------------------------------------------------
    const gameData = socketManager.gamedata[roomId];
    if (gameData === undefined) {
        logger.error("部屋データがないよ")
        return; // 無効な部屋なら無視
    }
    // logger.log("既存部屋に対する処理")

    const patch : DeepPartial<BabylonDataType> = {};
    const patchForAdd: DeepPartial<BabylonDataType> = {};
    const patchForRemove: DeepPartial<BabylonDataType> = {};
    const patchForUpdate: DeepPartial<BabylonDataType> = {};

    // 現在プレイヤー名
    const playerName = gameData.userInfoMap[gameData.playerIds[0]]?.userName ?? ""
    
    // ------------------------------------------------------------
    // アクセスユーザにデータ送信＆全体ユーザ通知
    switch (messageType) {
        // ------------------------------------------------------------
        // 接続
        case "connect": 
            if (msgData.preUserName && msgData.preUserName !== userName) {
                patch.logs = getLog(`${userName}(${msgData.preUserName})さんが入室しました。`);
            } else {
                patch.logs = getLog(`${userName}さんが入室しました。`);
            }
            if (userId in gameData.userInfoMap) { // 更新
                patchForUpdate.userInfoMap = {[userId]:{ userName: userName, online: true }}
            } else { // 追加
                patchForAdd.userInfoMap = {[userId]: initUserInfo(userName, msgData.color, msgData.icon)}
            }
            socketManager.update(roomId, {patchForAdd, patchForUpdate})
            socketManager.send(roomId, userId, {data: gameData, patchForAdd: patchForAdd, patchForUpdate: patchForUpdate})
            break;

        // ------------------------------------------------------------
        // チャット
        case "addChat":
            patch.chat = [{ time: getCurrentTime(), userName, content: msgData.content }]
            break;

        // -----------------------------------------------------------
        // 参加申請
        case "joinGame":
            if (gameData.playerIds.includes(userId)) return;
            if (gameData.playerIds.length >= 4) return;
            patchForAdd.playerIds = [userId];
            patch.logs = getLog(`${userName}さんがゲームに参加しました。`);
            break;

        // ------------------------------------------------------------
        // 参加取消
        case "notJoinGame":
            if (!gameData.playerIds.includes(userId)) return;
            patchForRemove.playerIds = [userId];
            patch.logs = getLog(`${userName}さんが参加を取り消しました。`)
            break;

        // ------------------------------------------------------------
        // 色選択
        case "selectUserColor":
            patchForUpdate.userInfoMap = { [userId]: { color: msgData.color } }
            break;

        // ------------------------------------------------------------
        // アイコン選択
        case "selectUserIcon":
            patchForUpdate.userInfoMap = { [userId]: { icon: msgData.icon } }
            break;

        // ############################################################
        // ゲーム開始
        // ############################################################
        // 初期化
        case "startGame":
            // プレイヤー順をランダムに決定する。
            const playerIds = shuffleArray([...gameData.playerIds]);
            patch.playerIds = [...playerIds];

            // プレイヤー情報を作成
            patch.playerInfoMap = {}
            const flowers = ["blue", "red", "white", "yellow"]
            for (let i=0; i<playerIds.length; i++) {
                const flower = popRandom(flowers) as FlowerType;
                patch.playerInfoMap[playerIds[i]] = initPlayerInfo(flower)
            }

            patch.logs = getLog("ゲームを開始します。");
            patch.roomStatus = "progress";
            if (playerIds.length <= 3) {
                // 2/3人プレイの場合： 採石場から粘土タイルを6/3枚取り除きます。
                patch.phase = "setup";
                patch.removeQuarry = playerIds.length <= 2 ? 6 : 3;
                patch.removeQuarry = playerIds.length; // #TODO
            } else {
                patch.phase = "quarry";
                patch.round = 1
            }
            patch.logs = getLog(`${playerName}さんのターンです。`)
            patch.quarry = getRandomQuarry()
            break;

        // ------------------------------------------------------------
        // 【セットアップ】タイル除去
        case "removeTile":
            // 次のプレイヤー
            setNextPlayerInfo(patch, gameData);
            // 除去タイル数-1
            patch.removeQuarry = gameData.removeQuarry - 1
            // タイルを除去
            const [_, log] = removeQuarryTile({patch, quarry:gameData.quarry, index:msgData.index, removeQuarry:gameData.removeQuarry})
            // ログ
            patch.logs = getLog(`タイルが除外されました。${log}`)

            // 0枚になったらゲーム開始
            if (patch.removeQuarry == 0) {
                patch.phase = "quarry"
            }
            break;

        // ------------------------------------------------------------
        // 【採石フェーズ】タイル獲得 -> 建築フェーズ
        case "getTile":
            patch.phase = "building"

            // 取得タイル
            const [tileInfo, log1] = removeQuarryTile({patch, quarry:gameData.quarry, index:msgData.index, removeQuarry:gameData.removeQuarry})
            patch.logs = getLog(`${playerName}さんがタイルを獲得しました。${log1}`)
            logger.error("tileInfo:", tileInfo)
            const pMap = resetPreviewPillars(gameData.playerInfoMap[userId]);
            logger.error("pMap:", pMap)
            
            patchForUpdate.playerInfoMap = {[userId]: { 
                // 柱を追加
                pillar: gameData.playerInfoMap[userId].pillar + msgData.pillar as number,
                // 獲得タイル
                storageTiles: [ ...gameData.playerInfoMap[userId].storageTiles, { ...tileInfo, tileNo: gameData.round } ],
                // 選択対象
                selectTarget: "pillar",
                // プレビュー柱のリセット
                previewPillarMap: pMap,
                // その他初期化
                selectedPillarMap: {},
                previewTileMap: {},
                selectedTileMap: {},
                previewComponentMap: {},
                selectedComponentMap: {},
            }}
            break;
            

        // ------------------------------------------------------------
        // 【建築フェーズ】柱選択
        case "selectPillar":
            // 座標＝キー
            const {x, y, z} = msgData;
            const key = `${x},${y},${z}`;

            // 柱の数、選択状態の切り替え
            let pillar = gameData.playerInfoMap[userId].pillar
            const previewMap = {...gameData.playerInfoMap[userId].previewPillarMap}
            const selectedPillarMap = {...gameData.playerInfoMap[userId].selectedPillarMap}
            if (previewMap[key] === true) {
                // プレビューをクリックした場合
                if (pillar == 0) return;
                pillar--;
                previewMap[key] = false; // プレビュー解除
                selectedPillarMap[key] = 1; // 選択
                
            } else if (selectedPillarMap[key] > 0) {
                // 選択中の場合
                if (selectedPillarMap[key] == 2 || (selectedPillarMap[key] == 1 && pillar == 0)) {
                    pillar += selectedPillarMap[key];
                    delete selectedPillarMap[key];
                    previewMap[key] = true;
                } else {
                    pillar--;
                    selectedPillarMap[key] = 2;
                }
            }
            // ------------------------------
            // タイル配置可能箇所の検証
            // ------------------------------
            // チェック対象の座標を確認する
            const previewTileMap = getPlacableTiles({
                selectedPillarMap: selectedPillarMap,
                componentMap: gameData.playerInfoMap[userId].confirmedComponentMap,
                confirmedTileMap: gameData.playerInfoMap[userId].confirmedTileMap,
                confirmedPillarMap: gameData.playerInfoMap[userId].confirmedPillarMap,
            })

            logger.error("[previewTileMap]", previewTileMap)

            patchForUpdate.playerInfoMap = { [userId]: { 
                pillar,
                previewPillarMap: previewMap,
                selectedPillarMap: selectedPillarMap,
                previewTileMap: previewTileMap,
            }};
            break;

        // ------------------------------------------------------------
        // 柱リセット
        case "resetPillar":
            patchForUpdate.playerInfoMap = {[userId]: { 
                pillar: 
                    gameData.playerInfoMap[userId].pillar
                    + Object.values(gameData.playerInfoMap[userId].selectedPillarMap).map(v=>v).reduce((s,e)=>s+e, 0),
                previewPillarMap: {
                    ...Object.fromEntries(Object.keys(gameData.playerInfoMap[userId].previewPillarMap).map((key) =>[key, true])),
                },
                selectedPillarMap: {},
            }}
            break;
        
        // ------------------------------------------------------------
        // 柱確定
        case "confirmPillar":
            patchForUpdate.playerInfoMap = { [userId]: { selectTarget: "tile" }};
            break;
        
        // ------------------------------------------------------------
        // 柱を設置せずにターン終了
        case "finishWithoutBuilding":
            patchForUpdate.playerInfoMap = {[userId]: { 
                // 選択中の柱の数を還元する
                pillar: Math.min(
                    MAX_PILLAR,
                    gameData.playerInfoMap[userId].pillar
                    + Object.values(gameData.playerInfoMap[userId].selectedPillarMap).map(v=>v).reduce((s,e)=>s+e, 0)
                ),
                selectTarget: "none",
                previewPillarMap: {},
                selectedPillarMap: {},
                previewTileMap: {},
                selectedTileMap: {},
            }}

            // 次のプレイヤーへ
            setNextPlayerInfo(patch, gameData);
            patch.phase = "quarry"
            break;
        
        // ------------------------------------------------------------
        // タイル選択
        case "selectTile":{
                const {x,y,z,tileInfo} = msgData;
                const key = `${x},${y},${z}`;
                const previewMap = {...gameData.playerInfoMap[userId].previewTileMap}
                const selectedMap = {...gameData.playerInfoMap[userId].selectedTileMap}
                if (key in selectedMap) {
                    // 削除
                    delete selectedMap[key];
                    previewMap[key] = true;
                } else {
                    // 追加
                    selectedMap[key] = tileInfo;
                    previewMap[key] = false;
                }
                patchForUpdate.playerInfoMap = { [userId]: {
                    previewTileMap: previewMap,
                    selectedTileMap: selectedMap,
                } }
            }
            break;
        
        // ------------------------------------------------------------
        // タイルリセット
        case "resetTile":{
                patchForUpdate.playerInfoMap = { [userId]: {
                    previewTileMap: Object.fromEntries(
                        Object.keys(gameData.playerInfoMap[userId].previewTileMap).map((pos)=>([pos, true]))
                    ),
                    selectedTileMap: {}
                } }
            }
            break
        // ------------------------------------------------------------
        // タイル回転
        case "rotateTile":{
                const {x,y,z,tileInfo} = msgData;
                const symbols = tileInfo.symbols as SymbolType[]
                patchForUpdate.playerInfoMap = { [userId]: {
                    selectedTileMap: {
                        ...gameData.playerInfoMap[userId].selectedTileMap,
                        [`${x},${y},${z}`]: {
                            ...tileInfo,
                            symbols: [symbols[3], symbols[0], symbols[1], symbols[2]],
                            rotate: (tileInfo.rotate + 1 % 4),
                        }
                    },
                } }
            }
            break;
        
        // ------------------------------------------------------------
        // タイル確定
        case "confirmTile":{
            // 仮確定タイル
            const preconfirmedTile = {
                // 基準点（描画に使うので情報はそのまま）
                ...Object.fromEntries(Object.entries(gameData.playerInfoMap[userId].selectedTileMap).map(([pos,info]) => {
                    const [x,y,z] = pos.split(",").map(Number);
                    return [`${x},${y},${z}`, { ...info, display: true}]
                }) ),
                // 基準点以外を display: false で追加。Symbolsは該当シンボルで埋める
                ...Object.fromEntries(Object.entries(gameData.playerInfoMap[userId].selectedTileMap).map(([pos,info]) => {
                    const [x,y,z] = pos.split(",").map(Number);
                    return [`${x+1},${y},${z}`, { ...info, symbols: [info.symbols[1],info.symbols[1],info.symbols[1],info.symbols[1]], display: false}]
                }) ),
                ...Object.fromEntries(Object.entries(gameData.playerInfoMap[userId].selectedTileMap).map(([pos,info]) => {
                    const [x,y,z] = pos.split(",").map(Number);
                    return [`${x+1},${y},${z+1}`, { ...info, symbols: [info.symbols[2],info.symbols[2],info.symbols[2],info.symbols[2]], display: false}]
                }) ),
                ...Object.fromEntries(Object.entries(gameData.playerInfoMap[userId].selectedTileMap).map(([pos,info]) => {
                    const [x,y,z] = pos.split(",").map(Number);
                    return [`${x},${y},${z+1}`, { ...info, symbols: [info.symbols[3],info.symbols[3],info.symbols[3],info.symbols[3]], display: false}]
                }) ),
            }
            // 柱の上に確定タイルがない場合、柱を削除
            let pillar = gameData.playerInfoMap[userId].pillar;
            const selectedPillarMap = Object.fromEntries(
                Object.entries(gameData.playerInfoMap[userId].selectedPillarMap).filter(([p, h])=>{
                    const [x,y,z] = p.split(",").map(Number);
                    if (h === 1 && `${x},${y+1},${z}` in preconfirmedTile
                        || h === 2 && `${x},${y+2},${z}` in preconfirmedTile) {
                        return true
                    } else {
                        pillar++
                        return false
                    }
                }).map(([p,h])=>[p,h])
            )
            const statueList = Object.entries(gameData.playerInfoMap[userId].confirmedComponentMap)
                .filter(([_,v])=>v.symbol==="statue").map(([pos,_])=>{
                    const [x,y,z,d] = pos.split(",").map(Number)
                    return `${x},${y},${z}`
                })

            // 仮確定タイルの下に柱・彫像がない場合、展望台を追加
            const componentMap = Object.fromEntries(Object.keys(preconfirmedTile).filter((pos) => {
                const [x,y,z] = pos.split(",").map(Number);
                return !(selectedPillarMap[`${x},${y-1},${z}`] == 1
                        || selectedPillarMap[`${x},${y-2},${z}`] == 2
                        || statueList.includes(`${x},${y-1},${z}`))
            }).map((pos) => ([`${pos}`, {
                symbol: "belvederes",
                direction: randInt(4),
                display: true,
            } as ComponentType])))

            patchForUpdate.playerInfoMap = { [userId]: {
                pillar: pillar,
                previewTileMap: {},
                selectTarget: "decoration",
                selectedPillarMap: selectedPillarMap,
                previewComponentMap: {
                    ...getPlacableDecoration(
                        gameData.playerInfoMap[userId].confirmedTileMap,
                        preconfirmedTile,
                        {...componentMap, ...gameData.playerInfoMap[userId].confirmedComponentMap},
                    ),
                },
                selectedComponentMap: {...componentMap},
            }};}
            break

        // ------------------------------------------------------------
        // コンポーネント選択
        // 彫像
        case "selectStatue": {
                const {position} = msgData;
                const previewMap = {...gameData.playerInfoMap[userId].previewComponentMap}
                const selectedMap = {...gameData.playerInfoMap[userId].selectedComponentMap}
                const key = `${position}`
                if (position in previewMap && previewMap[position].display === true) {
                    previewMap[key] = {symbol: "statue", direction: 2, display: false}
                    selectedMap[key] = {symbol: "statue", direction: 2, display: true}
                } else {
                    delete selectedMap[key]
                    previewMap[key] = {symbol: "statue", direction: 2, display: true}
                }
                patchForUpdate.playerInfoMap = { [userId]: {
                    previewComponentMap: previewMap,
                    selectedComponentMap: selectedMap,
                } }
            }
            break
        // 橋
        case "selectBridge": {
                const {position} = msgData;
                const [x,y,z,d] = position.split(",").map(Number)
                const pos2 = d==0 ? `${x},${y},${z-2}`
                            :d==1 ? `${x-2},${y},${z}`
                            :d==2 ? `${x},${y},${z+2}`
                            :`${x+2},${y},${z}`
                const previewMap = {...gameData.playerInfoMap[userId].previewComponentMap}
                const selectedMap = {...gameData.playerInfoMap[userId].selectedComponentMap}
                if (position in previewMap && previewMap[position].display === true) {
                    previewMap[position] = {symbol: "bridge", direction: d, display: false}
                    selectedMap[position] = {symbol: "bridge", direction: d, display: true}
                    // 対応
                    if (pos2 in previewMap) previewMap[pos2].display = false
                } else {
                    delete selectedMap[position]
                    previewMap[position] = {symbol: "bridge", direction: d, display: true}
                    if (pos2 in previewMap) previewMap[pos2].display = true
                }
                patchForUpdate.playerInfoMap = { [userId]: {
                    previewComponentMap: previewMap,
                    selectedComponentMap: selectedMap,
                } }
            }
            break
        // 噴水
        case "selectFountain": {
                const {position} = msgData;
                const [x,y,z,d] = position.split(",").map(Number)
                const pos2 = d==0 ? `${x},${y},${z-1}`
                            :d==1 ? `${x-1},${y},${z}`
                            :d==2 ? `${x},${y},${z+1}`
                            :`${x+1},${y},${z}`
                const previewMap = {...gameData.playerInfoMap[userId].previewComponentMap}
                const selectedMap = {...gameData.playerInfoMap[userId].selectedComponentMap}
                if (position in previewMap && previewMap[position].display === true) {
                    previewMap[position] = {symbol: "fountain", direction: d, display: false}
                    selectedMap[position] = {symbol: "fountain", direction: d, display: true}
                    // 対応
                    if (pos2 in previewMap) previewMap[pos2].display = false
                } else {
                    delete selectedMap[position]
                    previewMap[position] = {symbol: "fountain", direction: d, display: true}
                    if (pos2 in previewMap) previewMap[pos2].display = true
                }
                patchForUpdate.playerInfoMap = { [userId]: {
                    previewComponentMap: previewMap,
                    selectedComponentMap: selectedMap,
                } }
            }
            break
        // 階段
        case "selectStairway": {
                const {position} = msgData;
                const [x,y,z,d] = position.split(",").map(Number)
                const pos2 = d==0 ? `${x},${y+1},${z-1}`
                            :d==1 ? `${x-1},${y+1},${z}`
                            :d==2 ? `${x},${y+1},${z+1}`
                            :`${x+1},${y+1},${z}`
                const previewMap = {...gameData.playerInfoMap[userId].previewComponentMap}
                const selectedMap = {...gameData.playerInfoMap[userId].selectedComponentMap}
                if (position in previewMap && previewMap[position].display === true) {
                    previewMap[position] = {symbol: "stairway", direction: d, display: false}
                    selectedMap[position] = {symbol: "stairway", direction: d, display: true}
                    // 対応
                    if (pos2 in previewMap) previewMap[pos2].display = false
                } else {
                    delete selectedMap[position]
                    previewMap[position] = {symbol: "stairway", direction: d, display: true}
                    if (pos2 in previewMap) previewMap[pos2].display = true
                }
                patchForUpdate.playerInfoMap = { [userId]: {
                    previewComponentMap: previewMap,
                    selectedComponentMap: selectedMap,
                } }
            }
            break
        // ------------------------------------------------------------
        // 柱を設置しない
        case "discarding":
            patchForUpdate.playerInfoMap = {[userId]: { 
                selectTarget: "discarding",
                pillar: 
                    gameData.playerInfoMap[userId].pillar
                    + Object.values(gameData.playerInfoMap[userId].selectedPillarMap).map(v=>v).reduce((s,e)=>s+e, 0),
                previewPillarMap: {
                    ...Object.fromEntries(Object.keys(gameData.playerInfoMap[userId].previewPillarMap).map((key) =>[key, true])),
                },
                selectedPillarMap: {},
            }}
            break;

        // ------------------------------------------------------------
        // ターン確定
        case "confirmTurn":
            // 確定タイル
            const confirmedTile = {
                // 基準点（描画に使うので情報はそのまま）
                ...Object.fromEntries(Object.entries(gameData.playerInfoMap[userId].selectedTileMap).map(([pos,info]) => {
                    const [x,y,z] = pos.split(",").map(Number);
                    return [`${x},${y},${z}`, { ...info, display: true}]
                }) ),
                // 基準点以外を display: false で追加。Symbolsは該当シンボルで埋める
                ...Object.fromEntries(Object.entries(gameData.playerInfoMap[userId].selectedTileMap).map(([pos,info]) => {
                    const [x,y,z] = pos.split(",").map(Number);
                    return [`${x+1},${y},${z}`, { ...info, symbols: [info.symbols[1],info.symbols[1],info.symbols[1],info.symbols[1]], display: false}]
                }) ),
                ...Object.fromEntries(Object.entries(gameData.playerInfoMap[userId].selectedTileMap).map(([pos,info]) => {
                    const [x,y,z] = pos.split(",").map(Number);
                    return [`${x+1},${y},${z+1}`, { ...info, symbols: [info.symbols[2],info.symbols[2],info.symbols[2],info.symbols[2]], display: false}]
                }) ),
                ...Object.fromEntries(Object.entries(gameData.playerInfoMap[userId].selectedTileMap).map(([pos,info]) => {
                    const [x,y,z] = pos.split(",").map(Number);
                    return [`${x},${y},${z+1}`, { ...info, symbols: [info.symbols[3],info.symbols[3],info.symbols[3],info.symbols[3]], display: false}]
                }) ),
            }
            // ストレージタイル
            let storageTile = gameData.playerInfoMap[userId].storageTiles
            const selectedTileNo = Object.values(gameData.playerInfoMap[userId].selectedTileMap).map(v=>v.tileNo)
            if (msgData.selected !== undefined && msgData.selected >= 0) {
                storageTile = [storageTile[1 - msgData.selected]]
            } else {
                storageTile = gameData.playerInfoMap[userId].storageTiles.filter(v=>!selectedTileNo.includes(v.tileNo))
            }
            // コンポーネント
            const {confirmed, no} = confirmComponent(
                gameData.playerInfoMap[userId].selectedComponentMap,
                gameData.playerInfoMap[userId].objectNo,
            );

            patchForUpdate.playerInfoMap = { [userId]: {
                objectNo: no,
                pillar: Math.min( MAX_PILLAR, gameData.playerInfoMap[userId].pillar ),
                // 設置柱を確定
                confirmedPillarMap: {
                    ...gameData.playerInfoMap[userId].confirmedPillarMap,
                    ...gameData.playerInfoMap[userId].selectedPillarMap,
                },
                // 設置タイルを確定
                confirmedTileMap: {
                    ...gameData.playerInfoMap[userId].confirmedTileMap,
                    ...confirmedTile,
                },
                // ストレージから確定したタイルNoを削除
                storageTiles: storageTile,
                // コンポーネント
                confirmedComponentMap: { ...gameData.playerInfoMap[userId].confirmedComponentMap, ...confirmed, },
                // その他
                selectedPillarMap: {},
                previewPillarMap: {},
                selectedTileMap: {},
                previewTileMap: {},
                selectTarget: "none",
                previewComponentMap: {},
                selectedComponentMap: {},
            }};

            // debug: 次のプレイヤーへ
            setNextPlayerInfo(patch, gameData);
            patch.phase = "quarry"

            // 装飾へ

            break;
        
        // ------------------------------------------------------------
        // ターンをやり直す
        case "resetTurn":
            // プレビュー情報を削除
            patchForUpdate.playerInfoMap = {[userId]: { 
                // 選択中の柱の数を還元する
                pillar: gameData.playerInfoMap[userId].pillar
                    + Object.values(gameData.playerInfoMap[userId].selectedPillarMap).map(v=>v).reduce((s,e)=>s+e, 0),
                selectTarget: "pillar",
                previewPillarMap: {
                    ...Object.fromEntries(Object.keys(gameData.playerInfoMap[userId].previewPillarMap).map((key) =>[key, true])),
                    // ...Object.fromEntries(Object.keys(gameData.playerInfoMap[userId].selectedPillarMap).map((key) =>[key, true])),
                },
                selectedPillarMap: {},
                previewTileMap: {},
                selectedTileMap: {},
                previewComponentMap: {},
                selectedComponentMap: {},
            }}
            patch.phase = "building"
            break;
            
        // ------------------------------------------------------------
        // 
        // case "nextPlayer":
        //     // プレビュー情報を削除
        //     patchForUpdate.playerInfoMap = {[userId]: { 
        //         // 選択中の柱の数を還元する
        //         pillar: Math.min(
        //             MAX_PILLAR,
        //             gameData.playerInfoMap[userId].pillar
        //             + Object.keys(gameData.playerInfoMap[userId].selectedPillarMap).length
        //         ),
        //         selectTarget: "pillar",
        //         previewPillarMap: {},
        //         selectedPillarMap: {},
        //         previewTileMap: {},
        //         selectedTileMap: {},
        //     }}

        //     // 次のプレイヤーへ
        //     setNextPlayerInfo(patch, gameData);
        //     break;
        
        // ------------------------------------------------------------
        // 
        case "xxxxxx":
            break;
    }

  // ############################################################
  socketManager.update(roomId, {patch, patchForAdd, patchForRemove, patchForUpdate});
  socketManager.broadcast(roomId, {patch, patchForAdd, patchForRemove, patchForUpdate}, "refresh");

  logger.logBabylonData(gameData)
}

