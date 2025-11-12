/**
 * Babylon用データ型定義
 */

import { FlowerType } from "../const/babylon/flowers";
import { LayerType } from "../const/babylon/layers";
import { SymbolType } from "../const/babylon/symbols";

// WebSocket
export type BabylonDataType = {
  /** ルーム情報 */
  roomId: string;
  roomStatus: "waiting" | "progress" | "scoring" | "finish";
  logs: {time: string, content: string}[];
  chat: {time: string, userName: string, content: string}[];

  /** ゲーム情報 */
  playerIndex: number;
  playerIds: string[];
  phase: "waiting" | "setup" | "quarry" | "building" | "decoration";
  round: number;
  quarry: TerraceTileInfo[][];
  removeQuarry: number;
  
  /** ユーザ情報 */
  userInfoMap: { [userId: string]: UserInfoType };

  /** プレイヤー情報 */
  playerInfoMap: { [userId: string]: PlayerInfo };
}

export const defaultBabylonData: BabylonDataType = {
  roomId: "", roomStatus: "waiting", logs: [], chat: [],
  playerIndex: 0, playerIds: [], phase: "waiting", round: 0,
  quarry: [], removeQuarry: 0,
  userInfoMap: {},
  playerInfoMap: {},
}

export type UserInfoType = {
  userName: string;
  color: string;
  icon: string;
  logs: { time: string; content: string; }[];
  auth: boolean;
  online: boolean;
}

export type PlayerInfo = {
    // 花
    flower: string;
    // 柱残数
    pillar: number;
    // 所持タイル
    storageTiles: TerraceTileInfo[];
    // オブジェクトNo
    objectNo: number;

    // 配置対象
    selectTarget: "none" | "pillar" | "tile" | "decoration" | "discarding";
    
    // 柱
    previewPillarMap: {[pos: string]: boolean};
    selectedPillarMap: {[pos: string]: number};
    confirmedPillarMap: {[pos: string]: number}; 
    // ※柱の2段目、タイルの下の空間に0を設定

    // タイル
    previewTileMap: {[pos: string]: boolean};
    selectedTileMap: {[pos: string]: TerraceTileInfo};
    confirmedTileMap: {[pos: string]: TerraceTileInfo};
    // ※コンポーネント配置済みのシンボルはemptyにする

    // コンポーネント (pos: x,y,z,d)
    previewComponentMap: {[pos: string]: ComponentType};
    selectedComponentMap: {[pos: string]: ComponentType};
    confirmedComponentMap: {[pos: string]: ComponentType};
    
    // スコア
    
}

export type TerraceTileInfo = {
    tileNo: number;
    layer: LayerType;
    flower: FlowerType;
    symbols: SymbolType[];
    display: boolean;
    rotate: number;
}

export type ComponentType = {
  objectNo?: number;
    symbol: SymbolType;
    direction?: number; // 方向
    display?: boolean; // 可視
}