/**
 * Babylon用データ型定義
 */
// WebSocket
export type BabylonDataType = {
  roomInfo: RoomInfo; // ルーム情報
  gameInfo: GameInfo; // ゲーム情報
  userInfoMap: UserInfoMap; // ユーザ情報
  playerInfoMap: PlayerInfoMap; // プレイヤー情報
}
//
export type MessageType = {
  type: string;
  roomInfo: RoomInfo; // ルーム情報
  userInfoMap: UserInfoMap; // ユーザ情報
  gameInfo: GameInfo; // ゲーム情報
  playerInfoMap: PlayerInfoMap; // プレイヤー情報
}


//////////////////////////////////////////////////
/** ルーム情報 */
export type RoomInfo = { roomId: string; status: RoomState; logs: LogType[], chat: ChatType[]};
export type RoomState = "waiting" | "progress" | "scoring" | "finish";
export type LogType = {time: string, content: string};
export type ChatType = {time: string, userName: string, content: string};

//////////////////////////////////////////////////
/** ユーザ情報 */
export type UserInfo = { userName: string, color: string, logs: LogType[], auth: boolean, online: boolean };
export type UserInfoMap = {[userId: string]: UserInfo};

////////////////////////////////////////////////////////////////////////////////////////////////////
/** ゲーム情報 */
export type GameInfo = { playerIndex: number, playerIds: string[]; phase: Phase; round: number; };
// export type GameState = "waiting" | "progress" | "scoring" | "finish";
export type Phase = "waiting" | "setup" | "quarry" | "preview" | "decorate";

////////////////////////////////////////////////////////////////////////////////////////////////////
/** プレイヤー情報 */
export type PlayerInfo = {
  // userName: string;
  // status: PlayerStatus;
  // online: boolean;
  meshMap: {[k:string]: Mesh};
  tileMap: {[k:string]: TerraceTile};
};
export type PlayerInfoMap = {[userId: string]: PlayerInfo}
export type PlayerStatus = "waiting" | "setup" | "quarry" | "preview" | "decorate";

/** メッシュ */
export type Mesh = { x: number, y:number, z:number, type: MeshType, status: MeshStatus };
export type MeshType = "single-pillar" | "double-pillar" | "fountain";
export type MeshStatus = "preview" | "selected" | "confirmed";

/** テラスタイル */
export type TerraceTile = { x: number, y:number, z:number, number: number, symbol: SymbolType, status: MeshStatus };
export type SymbolType = "none" | "fountain";


