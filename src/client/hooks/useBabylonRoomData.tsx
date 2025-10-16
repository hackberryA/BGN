import { create } from "zustand";

type UserInfo = { userName: string };
type UserInfoMap = {[userId: string]: UserInfo};

type GameState = "waiting" | "progress" | "scoring" | "finish";
type Phase = "waiting" | "setup" | "quarry" | "preview" | "decorate";

/**************************************************
 * プレイヤー情報
 **************************************************/
// メッシュ
type Mesh = {
  x: number, y:number, z:number,
  type: string,    // single-pillar / fountain ...
  status: string,  // preview / selected / confirmed
};
// テラスタイル
type TerraceTile = {
  x: number, y:number, z:number,
  number: number, // タイル番号
  symbol: string, // none / fountain / stairway ...
  status: string,  // preview / selected / confirmed
}
// プレイヤー情報
type PlayerInfo = {
  userName: string;
  status: string;
  meshMap: {[k:string]: Mesh};
  tileMap: {[k:string]: TerraceTile};
};
type PlayerInfoMap = {[playerId: string]: PlayerInfo}

/**
 * ルームデータ型
 * @param logs         ログ
 * @param userLength   観戦者数
 * @param userInfo     観戦者情報
 * @param playerLength プレイヤー数
 * @param playerInfo   プレイヤー情報
 * @param status       進行状況： "waiting" | "progress" | "scoring" | "finish"
 * @param phase        フェーズ： "waiting" | "setup" | "quarry" | "preview" | "decorate";
 * @param round        ラウンド数
 */
export type BabylonRoomData = { 
  logs         : string[];
  userLength   : number;
  userInfo     : UserInfoMap;
  playerLength : number;
  playerInfo   : PlayerInfoMap;
  status       : GameState;
  phase        : Phase;
  round        : number;
};
const defaultRoomData: BabylonRoomData = {
  userLength: 0, userInfo: {}, playerLength: 0, playerInfo: {},
  logs: [], status: "waiting", phase: "waiting", round: 0,
}
type BabylonRoomDataMap = {[roomId: string]: BabylonRoomData}
/** ルームデータストア */
type BabylonRoomDataStore = {
  data: BabylonRoomDataMap;
  // 部屋の取得・追加・削除
  has: (roomId: string) => boolean;
  new: (roomId: string) => void;
  get: (roomId: string | undefined) => BabylonRoomData | undefined;
  remove: (roomId: string) => void;
  // 単位部屋データ更新
  update: (roomId: string, partial: Partial<BabylonRoomData>) => void;
}

export const useBabylonRoomData = create<BabylonRoomDataStore>((set, get) => ({
  data: {},
  has: (roomId) => !!get().data[roomId],
  new: (roomId) => set((state) => ({data: {...state.data, [roomId]: {...defaultRoomData}}})),
  get: (roomId) => roomId ? get().data[roomId] : undefined,
  remove: (roomId) =>
    set((state) => {
      if (!state.data[roomId]) return {};
      delete state.data[roomId];
      return { data: state.data };
    }),
  update: (roomId, partial) =>
    set((state) => {
      return {
        data: {
          ...state.data,
          [roomId]: {
            ...(state.data[roomId] || {}),
            ...partial
          }
        }
      };
    }),
}));
