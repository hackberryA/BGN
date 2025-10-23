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
