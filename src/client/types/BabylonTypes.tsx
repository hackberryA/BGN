/**
 * Babylon用データ型定義
 */

import { FlowerType } from "../components/babylon/const/flowers";
import { LayerType } from "../components/babylon/const/layers";
import { SymbolType } from "../components/babylon/const/symbols";

export type UserInfoType = {
  userName: string;
  color: string;
  icon: string;
  logs: { time: string; content: string; }[];
  auth: boolean;
  online: boolean;
}

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
  phase: "waiting" | "setup" | "quarry" | "building" | "decorate";
  round: number;
  quarry: TerraceTileInfo[][];
  removeQuarry: number;
  
  /** ユーザ情報 */
  userInfoMap: {
    [userId: string]: {
      userName: string;
      color: string;
      icon: string;
      logs: { time: string; content: string; }[];
      auth: boolean;
      online: boolean;
    }
  };
  /** プレイヤー情報 */
  playerInfoMap: { [userId: string]: PlayerInfoType };
}

export const defaultBabylonData: BabylonDataType = {
  roomId: "", roomStatus: "waiting", logs: [], chat: [],
  playerIndex: 0, playerIds: [], phase: "waiting", round: 0, quarry: [], removeQuarry: 0,
  userInfoMap: {},
  playerInfoMap: {},
}

export type PlayerInfoType = {
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

    // コンポーネント
    previewComponentMap: {[pos: string]: ComponentType};
    selectedComponentMap: {[pos: string]: ComponentType};
    confirmedComponentMap: {[pos: string]: ComponentType};

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
    symbol: SymbolType;
    direction?: number; // 方向
    display?: boolean; // 可視
    objectNo: number;
}