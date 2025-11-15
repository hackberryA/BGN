import { FLOWER } from "../const/babylon/flowers";
import { LAYER } from "../const/babylon/layers";
import { SYMBOLS, SymbolType } from "../const/babylon/symbols";
import { BabylonDataType, ComponentType, PlayerInfo, TerraceTileInfo, UserInfoType } from "../types/BabylonTypes";
import { DeepPartial } from "../websocket/SocketManager";
import { getCurrentTime } from "./CommonUtils";
import { logger } from "./logger";

/**************************************************
 * ログ
 **************************************************/
export const getLog = (content: string) => [{time: getCurrentTime(), content}];

/**************************************************
 * データ初期化
 **************************************************/
type InitDataProps = { roomId: string; userName: string; userId: string; color: string; icon: string; }
export const initData = ({roomId, userName, userId, color, icon}: InitDataProps) => ({
    roomId: roomId,
    roomStatus: "waiting",
    logs: getLog(`${userName}さんが入室しました。`),
    chat: [],
    playerIds: [],
    playerIndex: 0,
    phase: "waiting",
    round: 0,
    quarry: [],
    removeQuarry: 0,
    userInfoMap: {
    [userId]: {
        userName: userName,
        color: color,
        icon: icon,
        logs: getLog(`Welcome! ${userName}`),
        auth: true,
        online: true,
    }
    },
    playerInfoMap: {}
} as BabylonDataType);

/**************************************************
 * ユーザ情報
 **************************************************/
export const initUserInfo = (userName: string, color?: string, icon?: string) => ({
    userName: userName,
    color: color || "blue",
    icon: icon || "default",
    logs: [{time: getCurrentTime(), content: `Welcome! ${userName}`}],
    online: true,
    auth: false,
} as UserInfoType);

/**************************************************
 * プレイヤー情報
 **************************************************/
export const initPlayerInfo = (flower: string) => ({
    flower: flower,
    pillar: 0,
    objectNo: 0,
    storageTiles: [{
        tileNo: 0,
        layer: "starting",
        flower: flower,
        symbols: ["stairway", "bridge", "fountain", "statue"],
    }],
    previewPillarMap: {},
    selectedPillarMap: {},
    confirmedPillarMap: {},
    previewTileMap: {},
    selectedTileMap: {},
    confirmedTileMap: {},
    previewComponentMap: {},
    selectedComponentMap: {},
    confirmedComponentMap: {},
} as PlayerInfo)


/**************************************************
 * Next プレイヤー
 **************************************************/
export const setNextPlayerInfo = (patch: DeepPartial<BabylonDataType>, gameData: BabylonDataType) => {
    // next index
    patch.playerIndex = (gameData.playerIndex + 1) % gameData.playerIds.length
    if (patch.playerIndex == 0) {
        patch.round = gameData.round + 1
    }
    // log
    const playerName = gameData.userInfoMap[gameData.playerIds[patch.playerIndex]].userName
    patch.logs = [{ time: getCurrentTime(), content: `${playerName}さんのターンです。` }]
}


/**************************************************
 * 採掘場のタイルを除去（取得）
 **************************************************/
type RemoveQuarryTileProps = { patch: DeepPartial<BabylonDataType>, quarry: TerraceTileInfo[][], index: number, removeQuarry?: number }
export const removeQuarryTile = ({patch, quarry, index, removeQuarry=0}: RemoveQuarryTileProps) => {
    // 除去タイル数-1
    if (removeQuarry > 0) patch.removeQuarry = removeQuarry - 1
    // タイルを除去
    patch.quarry = [...quarry];
    patch.quarry[index] = [
        quarry[index][1],
        quarry[index][2],
        {...quarry[index][0], display: false}
    ]
    const q = quarry[index][0];

    // タイル情報を返却
    const layer = LAYER[q.layer];
    const flower = FLOWER[q.flower];
    const symbols = q.symbols.filter(v=>v!=="empty").map(symbol=>SYMBOLS[symbol]).join("、");
    return [q, `【${layer} | ${flower} | ${symbols}】`] as [TerraceTileInfo, string]
}

/**************************************************
 * プレビュー柱のリセット
 **************************************************/
export const resetPreviewPillars = (playerInfo: PlayerInfo) => {
    // プレビュ―柱初期化
    const xzList: string[] = []; // 各(x,z)に1個
    const pMap:{[pos: string]: boolean} = {}
    for (let y=15;y>=0;y--) { // y: 降順
        for (let x=0;x<8;x++) {
            for (let z=0;z<8;z++) {
                if (xzList.includes(`${x},${z}`)) continue;
                // 高さ0は全追加
                if (y==0) {
                    pMap[`${x},${y},${z}`] = true;
                    continue;
                }
                // 同階層にコンポーネントがあれば設置不可
                if (`${x},${y},${z}` in playerInfo.confirmedComponentMap) { xzList.push(`${x},${z}`); continue; }
                if (`${x},${y},${z},0` in playerInfo.confirmedComponentMap) { xzList.push(`${x},${z}`); continue; }
                if (`${x},${y},${z},1` in playerInfo.confirmedComponentMap) { xzList.push(`${x},${z}`); continue; }
                if (`${x},${y},${z},2` in playerInfo.confirmedComponentMap) { xzList.push(`${x},${z}`); continue; }
                if (`${x},${y},${z},3` in playerInfo.confirmedComponentMap) { xzList.push(`${x},${z}`); continue; }
                // 同階層にタイルが見つかれば設置可能
                if (`${x},${y},${z}` in playerInfo.confirmedTileMap) {
                    pMap[`${x},${y},${z}`] = true;
                    xzList.push(`${x},${z}`);
                }
            }
        }
    }
    return pMap
}
/**************************************************
 * 選択済み柱の状態から、設置可能なタイルを決定する
 **************************************************/
export type GetPlacableTilesProps = {
    selectedPillarMap: { [pos: string]: number; };
    componentMap: { [pos: string]: { symbol: SymbolType; }; };
    confirmedTileMap: { [pos: string]: TerraceTileInfo; };
    confirmedPillarMap: { [pos: string]: number; };
}
export const getPlacableTiles = ({selectedPillarMap, componentMap, confirmedTileMap, confirmedPillarMap}: GetPlacableTilesProps) => {
    const checkPosList = [
        // 高さが1の柱
        ...Object.entries(selectedPillarMap).filter(([_, v]) => v === 1).map(([pos, _]) => pos),
        // 高さが2の柱 (y+1)
        ...Object.entries(selectedPillarMap).filter(([_, v]) => v === 2).map(([pos, _]) => { 
            const [x,y,z] = pos.split(",").map(Number);
            return `${x},${y+1},${z}`; 
        }),
        // 彫像
        ...Object.entries(componentMap).filter(([_, v]) => v.symbol === "statue").map(([pos, _]) => pos)
    ];
    const previewTileMap:{[pos: string]: boolean} = {};
    // 3つの全組合せ
    for (let i = 0; i < checkPosList.length - 2; i++) {
        for (let j = i + 1; j < checkPosList.length - 1; j++) {
            for (let k = j + 1; k < checkPosList.length; k++) {
            // 基準点を取得
            const refPos = searchRefPos({
                pos1: checkPosList[i].split(",").map(Number),
                pos2: checkPosList[j].split(",").map(Number),
                pos3: checkPosList[k].split(",").map(Number),
            })
            if (refPos === undefined) continue;
            
            
            // 2段柱がないこと
            if (hasDoublePillar(refPos, selectedPillarMap)) continue;
            if (hasDoublePillar(refPos, confirmedPillarMap)) continue;
            
            // 設置済みタイルと重ならないこと
            if (hasPlacedTile(refPos, confirmedTileMap)) continue;

            // 真下のタイルと一致しないこと
            if (matchDirectlyBelowTile(refPos, confirmedTileMap)) continue;
            
            // タイル配置可能座標を追加
            previewTileMap[[refPos[0], refPos[1]+1, refPos[2]].join(",")] = true;
            }
        }
    }
    return previewTileMap
}
type SearchRefPosProps = {
    pos1: number[];
    pos2: number[];
    pos3: number[];
}
const searchRefPos = ({pos1, pos2, pos3}: SearchRefPosProps) => {
    // 3点から基準点を探す。
    const [x1, y1, z1] = pos1;
    const [x2, y2, z2] = pos2;
    const [x3, y3, z3] = pos3;

    // 同階層であること
    if (y1!==y2 || y2!==y3 || y3!==y1) {
        return undefined;
    }
    // 2x2に収まっていること
    const xs = [x1, x2, x3];
    const zs = [z1, z2, z3];
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    if ((maxX - minX) > 1 || (maxZ - minZ) > 1) {
        return undefined;
    }
    // 基準点を返却
    return [minX, y1, minZ]  
}

const hasDoublePillar = (pos: number[], selectedMap: { [pos: string]: number;}) => {
    const [x, y, z] = pos;
    if (selectedMap[`${x},${y},${z}`] === 2) return true;
    if (selectedMap[`${x+1},${y},${z}`] === 2) return true;
    if (selectedMap[`${x},${y},${z+1}`] === 2) return true;
    if (selectedMap[`${x+1},${y},${z+1}`] === 2) return true;
    return false;
}
const hasPlacedTile = (pos: number[], confirmedMap: { [pos: string]: TerraceTileInfo;}) => {
    const [x, y, z] = pos;
    if (`${x},${y+1},${z}` in confirmedMap) return true;
    if (`${x+1},${y+1},${z}` in confirmedMap) return true;
    if (`${x},${y+1},${z+1}` in confirmedMap) return true;
    if (`${x+1},${y+1},${z+1}` in confirmedMap) return true;
    return false
}
const matchDirectlyBelowTile = (pos: number[], confirmedMap: { [pos: string]: TerraceTileInfo;}) => {
    const [x, y, z] = pos;
    if (!(`${x},${y},${z}` in confirmedMap)) return false;
    if (!(`${x+1},${y},${z}` in confirmedMap)) return false;
    if (!(`${x},${y},${z+1}` in confirmedMap)) return false;
    if (!(`${x+1},${y},${z+1}` in confirmedMap)) return false;

    const belowList = [
        confirmedMap[`${x},${y},${z}`].tileNo,
        confirmedMap[`${x+1},${y},${z}`].tileNo,
        confirmedMap[`${x},${y},${z+1}`].tileNo,
        confirmedMap[`${x+1},${y},${z+1}`].tileNo,
    ]
    return Math.min(...belowList) === Math.max(...belowList)
}

/**************************************************
 * 選択済みタイルの配置から、設置可能な装飾を決定する
 **************************************************/
export const getPlacableDecoration = (
    confirmedTileMap: { [pos: string]: TerraceTileInfo },
    selectedTileMap: { [pos: string]: TerraceTileInfo },
    componentMap: { [k: string]: ComponentType },
) => {
    const tileMap = {...confirmedTileMap, ...selectedTileMap}
    const result: {[pos: string]: ComponentType} = {}
    Object.entries(selectedTileMap).map(([pos, info]) => {
        const [x,y,z] = pos.split(",").map(Number);
        const ret = checkDecoration(x, y, z, info.symbols[0], tileMap, componentMap)
        ret.forEach(([pos, info]: any) => result[pos] = info)
    })
    logger.error("PlacableDecoration=", result)
    return result
}
const checkDecoration = (x: number, y: number, z: number, symbol: SymbolType, 
    tileMap: {[pos: string]: TerraceTileInfo}, 
    componentMap: { [k: string]: ComponentType }
) => {
    // 基準点にコンポーネントがある場合はスキップ
    if (`${x},${y},${z}` in componentMap) return [];
    switch (symbol) {
        case "stairway":
            return checkStairway(x, y, z, tileMap, componentMap)
        case "fountain":
            return checkFountain(x, y, z, tileMap, componentMap)
        case "statue":
            return checkStatue(x, y, z, tileMap, componentMap)
        case "bridge":
            return checkBridge(x, y, z, tileMap, componentMap)
    }
    return []
}
// 階段
const checkStairway = (x: number, y: number, z: number, tileMap: {[pos: string]: TerraceTileInfo}, componentMap: { [k: string]: ComponentType; }) => {
    const ret = []
    const check = (x1:number, y1:number, z1:number, x2:number, y2:number, z2:number, d:number)  => {
        // 基準点の上にタイルがある場合はスキップ
        if (`${x1},${y1+1},${z1}` in tileMap) return null
        // 対象地点にコンポーネントが存在する場合はスキップ
        const pos1 = `${x1},${y1},${z1}`
        const pos2 = `${x2},${y2},${z2}`
        if (!(pos1 in tileMap)) return null
        if (!(pos2 in tileMap)) return null
        if (pos1 in componentMap) return null
        if (pos2 in componentMap) return null
        if (tileMap[pos1].symbols[0] !== "stairway") return null
        if (tileMap[pos2].symbols[0] !== "stairway") return null
        return [`${pos1},${d}`, {direction: d, symbol: "stairway" as SymbolType, display: true, objectNo: 0}]
    }
    // 対象地点を基準
    ret.push(check(x, y, z, x,   y+1, z+1, 0));
    ret.push(check(x, y, z, x+1, y+1, z,   1));
    ret.push(check(x, y, z, x,   y+1, z-1, 2));
    ret.push(check(x, y, z, x-1, y+1, z,   3));
    // 斜め下を基準
    ret.push(check(x,   y-1, z-1, x, y, z, 0));
    ret.push(check(x-1, y-1, z,   x, y, z, 1));
    ret.push(check(x,   y-1, z+1, x, y, z, 2));
    ret.push(check(x+1, y-1, z,   x, y, z, 3));
    return ret.filter(v=>v!==null)
}
// 噴水
const checkFountain = (x: number, y: number, z: number, tileMap: {[pos: string]: TerraceTileInfo}, componentMap: { [k: string]: ComponentType; }) => {
    const ret = []
    const check = (x1:number, y1:number, z1:number, x2:number, y2:number, z2:number, d:number)  => {
        const pos1 = `${x1},${y1},${z1}`
        const pos2 = `${x2},${y2},${z2}`
        if (!(pos1 in tileMap)) return null
        if (!(pos2 in tileMap)) return null
        if (pos1 in componentMap) return null
        if (pos2 in componentMap) return null
        if (tileMap[pos1].symbols[0] !== "fountain") return null
        if (tileMap[pos2].symbols[0] !== "fountain") return null
        return [`${pos1},${d}`, {direction: d, symbol: "fountain" as SymbolType, display: true, objectNo: 0}]
    }
    // 基準点と同じ高さの周囲4マスを確認
    ret.push(check(x, y, z, x,   y, z+1, 0));
    ret.push(check(x, y, z, x+1, y, z,   1));
    ret.push(check(x, y, z, x,   y, z-1, 2));
    ret.push(check(x, y, z, x-1, y, z,   3));
    return ret.filter(v=>v!==null)
}
// 橋
const checkBridge = (x: number, y: number, z: number, tileMap: {[pos: string]: TerraceTileInfo}, componentMap: { [k: string]: ComponentType; }) => {
    const ret = []
    const check = (x:number, y:number, z:number, dx:number, dz:number, d:number)  => {
        const pos1 = `${x},${y},${z}`
        const pos2 = `${x+dx},${y},${z+dz}`
        const pos3 = `${x+dx*2},${y},${z+dz*2}`
        if (!(pos1 in tileMap)) return null
        if (pos2 in tileMap) return null
        if (!(pos3 in tileMap)) return null
        if (pos1 in componentMap) return null
        if (pos2 in componentMap) return null
        if (pos3 in componentMap) return null
        if (tileMap[pos1].symbols[0] !== "bridge") return null
        if (tileMap[pos3].symbols[0] !== "bridge") return null
        return [`${pos1},${d}`, {direction: d, symbol: "bridge" as SymbolType, display: true, objectNo: 0}]
    }
    ret.push(check(x, y, z,  0, +1, 0));
    ret.push(check(x, y, z, +1,  0, 1));
    ret.push(check(x, y, z,  0, -1, 2));
    ret.push(check(x, y, z, -1,  0, 3));
    return ret.filter(v=>v!==null)
}
// 彫像
const checkStatue = (x: number, y: number, z: number, tileMap: {[pos: string]: TerraceTileInfo}, componentMap: { [k: string]: ComponentType; }) => {
    // 彫像が存在する座標リスト
    const statuePosList = Object.entries(componentMap).filter(([pos,info])=>{
        // 彫像でなければfalse
        if (info.symbol !== "statue") return false
        // 彫像より上にタイルがある場合はfalse
        const [x,y,z] = pos.split(",").map(Number)
        for (let h=y+1; h<15; h++) {
            if (`${x},${h},${z}` in tileMap) return false
        }
        return true
    }).map(([pos,_])=>pos)
    // x座標リスト
    const xList = statuePosList.map((pos) => pos.split(",").map(Number)[0])
    // z座標リスト
    const zList = statuePosList.map((pos) => pos.split(",").map(Number)[2])
    logger.error("xList=", xList)
    logger.error("zList=", zList)
    const ret = []
    const check = (x:number, y:number, z:number, d:number)  => {
        const key = `${x},${y},${z}`
        logger.error(x,y,z)
        if (key in componentMap) return null
        if (xList.length > 0) {
            if (zList.length > 0) {
                if (!xList.includes(x) && !zList.includes(z)) {
                    return null
                }
            } else if (!xList.includes(x)) {
                return null
            }
        } else if (zList.length > 0 && !zList.includes(z)) {
            return null
        }
        return [`${key},${d}`, {direction: d, symbol: "statue" as SymbolType, display: true, objectNo: 0}]
    }
    ret.push(check(x,y,z,0))
    logger.error("ret=", ret )
    logger.error("filter=", ret.filter(v=>v!==null) )
    return ret.filter(v=>v!==null)  
}

/**************************************************
 * 装飾を確定する
 **************************************************/
export const confirmComponent = (selected: { [pos: string]: ComponentType; }, no: number) => {
    const confirmed = {} as { [pos: string]: ComponentType; }
    let objectNo = no + 1
    Object.entries(selected).forEach(([pos, info]) => {
        const [x,y,z,d] = pos.split(",").map(Number)
        switch (info.symbol) {
            case "belvederes":
                confirmed[pos] = {...info, objectNo}
                break;
            case "statue":
                confirmed[pos] = {...info, objectNo}
                break;
            case "fountain":
                confirmed[pos] = {...info, objectNo}
                if (d===0) {confirmed[`${x},${y},${z+1}`] = {...info, objectNo, display: false};}
                else if (d===1) {confirmed[`${x+1},${y},${z}`] = {...info, objectNo, display: false};}
                else if (d===2) {confirmed[`${x},${y},${z-1}`] = {...info, objectNo, display: false};}
                else if (d===3) {confirmed[`${x-1},${y},${z}`] = {...info, objectNo, display: false};}
                break;
            case "stairway":
                confirmed[pos] = {...info, objectNo}
                if (d===0) {confirmed[`${x},${y+1},${z+1}`] = {...info, objectNo, display: false};}
                else if (d===1) {confirmed[`${x+1},${y+1},${z}`] = {...info, objectNo, display: false};}
                else if (d===2) {confirmed[`${x},${y+1},${z-1}`] = {...info, objectNo, display: false};}
                else if (d===3) {confirmed[`${x-1},${y+1},${z}`] = {...info, objectNo, display: false};}
                break;
            case "bridge":
                confirmed[pos] = {...info, objectNo}
                if (d===0) {
                    confirmed[`${x},${y},${z+1}`] = {...info, objectNo, display: false};
                    confirmed[`${x},${y},${z+2}`] = {...info, objectNo, display: false};
                } else if (d===1) {
                    confirmed[`${x+1},${y},${z}`] = {...info, objectNo, display: false};
                    confirmed[`${x+2},${y},${z}`] = {...info, objectNo, display: false};
                } else if (d===2) {
                    confirmed[`${x},${y},${z-1}`] = {...info, objectNo, display: false};
                    confirmed[`${x},${y},${z-2}`] = {...info, objectNo, display: false};
                } else if (d===3) {
                    confirmed[`${x-1},${y},${z}`] = {...info, objectNo, display: false};
                    confirmed[`${x-2},${y},${z}`] = {...info, objectNo, display: false};
                }
                break;
        }
        no++
    })
    return {confirmed, no}
}