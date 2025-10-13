import { create } from "zustand";

// ユーザ情報
type UserInfo = { userName: string; icon: string};

// ゲーム状況
type GameState = 
| "waiting"  // 待機
| "progress" // 進行中
| "scoring"  // 得点計算
| "finish";  // 終了
// フェーズ
type Phase = 
| "setup"    // 人数に応じて採石場からタイル除去（セットアップ）
| "quarry"   // 1. 採石場からタイル選択
| "preview"  // 2. 柱・タイル配置
| "decorate";// 3. 装飾配置

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
  status: string;
  meshMap: Map<string, Mesh>;
  tileMap: Map<string, TerraceTile>;
};

/**************************************************
 * ルームデータ型定義
 **************************************************/
type RoomDataStore = {
  roomId: string;    setRoomId: (roomId: string) => void;
  status: GameState; setStatus: (status: GameState) => void;
  phase: Phase;      setPhase: (phase: Phase) => void;
  round: number;     setRound: (round: number) => void;
  logs: string[];     addLog: (log: string) => void,

  // 全接続者
  userIds: string[];
  addUserId: (userId: string) => void,

  userInfo: Map<string, UserInfo>;
  // Map操作
  getUserInfo: (userId: string) => UserInfo | undefined;
  addUserInfo: (userId: string, userInfo: UserInfo) => void;
  updateUserInfo: (userId: string, update: Partial<UserInfo>) => void;
  removeUserInfo: (userId: string) => void;

  // ゲーム参加者
  playerIds: string[];
  addPlayerId: (playerId: string) => void,

  playerInfo: Map<string, PlayerInfo>;
  // Map操作
  getPlayerInfo: (playerId: string) => PlayerInfo | undefined;
  addPlayerInfo: (playerId: string, playerInfo: PlayerInfo) => void;
  updatePlayerInfo: (playerId: string, update: Partial<PlayerInfo>) => void;
  removePlayerInfo: (playerId: string) => void;

};

export const useRoomData = create<RoomDataStore>((set, get) => ({
  roomId: "",        setRoomId: (roomId) => set({roomId}),
  status: "waiting", setStatus: (status) => set({status}),
  phase: "setup",    setPhase: (phase) => set({phase}),
  round: 0,          setRound: (round) => set({round}),

  // ログ
  logs: [],
  addLog: (log) => set((state) => ({logs: [...state.logs, log]})),

  // ユーザID
  userIds: [],
  addUserId: (id) => set((state) => ({playerIds: [...state.playerIds, id]})),

  // プレイヤー情報
  userInfo: new Map(),
  getUserInfo: (userId) => get().userInfo.get(userId),
  addUserInfo: (userId, userInfo) =>
    set((state) => {
      if (state.userInfo.has(userId)) return {};
      const newMap = new Map(state.userInfo);
      newMap.set(userId, userInfo);
      return { userInfo: newMap };
    }),
  updateUserInfo: (userId, update) =>
    set((state) => {
      if (!state.userInfo.has(userId)) return {};
      const old = state.userInfo.get(userId)!;
      const newMap = new Map(state.userInfo);
      newMap.set(userId, { ...old, ...update });
      return { userInfo: newMap };
    }),
  removeUserInfo: (userId) =>
    set((state) => {
      if (!state.userInfo.has(userId)) return {};
      const newMap = new Map(state.userInfo);
      newMap.delete(userId);
      return { userInfo: newMap };
    }),
    
  // プレイヤーID
  playerIds: [],
  addPlayerId: (id) => set((state) => ({playerIds: [...state.playerIds, id]})),

  // プレイヤー情報
  playerInfo: new Map(),
  getPlayerInfo: (id) => get().playerInfo.get(id),
  addPlayerInfo: (playerId, playerInfo) =>
    set((state) => {
      if (state.playerInfo.has(playerId)) return {};
      const newMap = new Map(state.playerInfo);
      newMap.set(playerId, playerInfo);
      return { playerInfo: newMap };
    }),
  updatePlayerInfo: (playerId, update) =>
    set((state) => {
      if (!state.playerInfo.has(playerId)) return {};
      const old = state.playerInfo.get(playerId)!;
      const newMap = new Map(state.playerInfo);
      newMap.set(playerId, { ...old, ...update });
      return { playerInfo: newMap };
    }),
  removePlayerInfo: (playerId) =>
    set((state) => {
      if (!state.playerInfo.has(playerId)) return {};
      const newMap = new Map(state.playerInfo);
      newMap.delete(playerId);
      return { playerInfo: newMap };
    }),
}));
