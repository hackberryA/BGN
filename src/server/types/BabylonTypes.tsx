/**
 * Babylon用データ型定義
 */

// WebSocket
export type BabylonDataType = {
  /** ルーム情報 */
  roomInfo: {
    roomId: string;
    status: "waiting" | "progress" | "scoring" | "finish";
    logs: {time: string, content: string}[];
    chat: {time: string, userName: string, content: string}[];
  };
  /** ゲーム情報 */
  gameInfo: {
    playerIndex: number;
    playerIds: string[];
    phase: "waiting" | "setup" | "quarry" | "preview" | "decorate";
    round: number;
  };
  
  /** ユーザ情報 */
  userInfoMap: {
      [userId: string]: {
      userName: string;
      color: string;
      logs: { time: string; content: string; }[];
      auth: boolean;
      online: boolean;
    }
  };
  /** プレイヤー情報 */
  playerInfoMap: {
    [userId: string]: {
      // 確定済みメッシュ
      confirmedMeshMap: {
        [k:string]: {
          pos: [x: number, y:number, z:number];
          type: "single-pillar" | "double-pillar" | "fountain" | "stairway" | "satue" | "bridge" | "belvederes";
          rotate?: number;
        }
      };
      // 選択中メッシュ
      selectedMeshMap: {
        [k:string]: {
          pos: [x: number, y:number, z:number];
          type: "single-pillar" | "double-pillar" | "fountain" | "stairway" | "satue" | "bridge" | "belvederes";
          rotate?: number;
        }
      };
      // 確定済みタイル
      confiremedTileMap: {
        [k:string]: {
          pos: [x: number, y:number, z:number];
          tileNo: number;
          symbol: "none" | "fountain" | "stairway" | "satue" | "bridge";
          flower: "red" | "white" | "blue" | "yellow";
          cornerType: "top-left" | "top-right" | "bottom-left" | "bottom-right"
        }
      };
      // 選択中タイル
      selectedTileMap: {
        [k:string]: {
          pos: [x: number, y:number, z:number];
          tileNo: number;
          symbol: "none" | "fountain" | "stairway" | "satue" | "bridge";
          flower: "red" | "white" | "blue" | "yellow";
          cornerType: "top-left" | "top-right" | "bottom-left" | "bottom-right"
        }
      };
    }
  };
}

//////////////////////////////////////////////////
/** ルーム情報 */
// export type RoomInfo = { roomId: string; status: RoomState; logs: LogType[], chat: ChatType[]};
// export type RoomState = "waiting" | "progress" | "scoring" | "finish";
// export type LogType = {time: string, content: string};
// export type ChatType = {time: string, userName: string, content: string};

//////////////////////////////////////////////////
/** ユーザ情報 */
// export type UserInfo = { userName: string, color: string, logs: LogType[], auth: boolean, online: boolean };
// export type UserInfoMap = {[userId: string]: UserInfo};

////////////////////////////////////////////////////////////////////////////////////////////////////
/** ゲーム情報 */
// export type GameInfo = { playerIndex: number, playerIds: string[]; phase: Phase; round: number; };
// export type GameState = "waiting" | "progress" | "scoring" | "finish";
// export type Phase = "waiting" | "setup" | "quarry" | "preview" | "decorate";

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// /** プレイヤー情報 */
// export type PlayerInfo = {
//   // userName: string;
//   // status: PlayerStatus;
//   // online: boolean;
//   meshMap: {[k:string]: Mesh};
//   tileMap: {[k:string]: TerraceTile};
// };
// export type PlayerInfoMap = {[userId: string]: PlayerInfo}
// export type PlayerStatus = "waiting" | "setup" | "quarry" | "preview" | "decorate";

// /** メッシュ */
// export type Mesh = { x: number, y:number, z:number, type: MeshType, status: MeshStatus };
// export type MeshType = "single-pillar" | "double-pillar" | "fountain";
// export type MeshStatus = "preview" | "selected" | "confirmed";

// /** テラスタイル */
// export type TerraceTile = { x: number, y:number, z:number, number: number, symbol: SymbolType, status: MeshStatus };
// export type SymbolType = "none" | "fountain";



