
import * as THREE from 'three';

export const MAIN_CANVAS_ID = "main"
// export const defaultMaterial = new CANNON.Material();


// 幅: 1マスを基準とする
// 高さ: 柱を基準とする
export const componentWidth = 50;
export const componentHeight = 30;
export const componentColor = 0xFFFFAA;


export const COMPONENTS = Object.freeze({
    // コンポーネント
    QUARRY: "quarry", // 採掘場
    PLAYER_BOARD: "player-board", // プレイヤーボード：4枚
    STARTING_TERRACE_TILE: "starting-teracce-tile", // スターティング・テラスタイル：4枚
    TERRACE_TILE: "terrace-tile", // テラスタイル：48枚
    ROUND_TOKEN: "round-token", // ラウンドトークン：14枚
    GAME_FINISH_TOKEN: "game-finish-token", // ゲーム終了トークン：1枚
    SCORE_PAD: "score-pad", // スコアパッド：1冊
    SINGLE_PILLAR: "single-pillar", // シングル柱：148本
    DOUBLE_PILLAR: "double-pillar", // ダブル柱：60本
    OBSERVATORY: "observatory", // 展望台：38個
    STAIR: "stair", // 階段：15個
    FOUNTAIN: "fountain", // 噴水：15個
    STATUE: "statue", // 彫像：38個
    BRIDGE: "bridge", // 橋：15個
    // その他
    PREVIEW_POINT: "preview-point",
    NONE: "none",
    UNPLACEBLE: "unplaceble", // 上にタイルが浮いてるので置けない場所
});
export const STATUS = {
    CONFIRMED: "confirmed",
    HOVER: "hover",
    SELECTED: "selected",
    PREVIEW: "preview",
    INVISIBLE: "invisible",
    PREINVISIBLE: "preinvisible",
}
export const COMPONENT_LAYER = {
    DEFAULT: 0,
    PREVIEW: 1,
    SELECTED: 1,
    INVISIBLE: 3,
}

export const defaultData = Object.freeze({
    component: COMPONENTS.NONE, // コンポーネントの種類
    status: STATUS.INVISIBLE, // 表示状態
    floor: 0, index: 0, status: "", position: {x:0,y:0,z:0},
})
export const LAYER = Object.freeze({ CLAY: 3, GRANITE: 2, BASALT: 1, BEDROCK: -1 });
export const FLOWER = Object.freeze({ WHITE: 1, BLUE: 2, RED: 3, YELLOW: 4, NONE: -1 });
export const SYMBOL = Object.freeze({ FOUNTAIN: 1, BRIDGE: 2, STATUE: 3, STAIR: 4, NONE: -1});
export const BEDROCK = Object.freeze({layer: LAYER. BEDROCK, flower: FLOWER. NONE, symbol: [SYMBOL. NONE, SYMBOL. NONE, SYMBOL. NONE, SYMBOL. NONE]});
export const CARD_LIST_1 = Object.freeze([
    {layer: LAYER.CLAY, flower: FLOWER.WHITE,  symbol: [SYMBOL.FOUNTAIN, SYMBOL.NONE, SYMBOL.BRIDGE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.WHITE,  symbol: [SYMBOL.FOUNTAIN, SYMBOL.NONE, SYMBOL.STAIR,  SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.WHITE,  symbol: [SYMBOL.STAIR,    SYMBOL.NONE, SYMBOL.STATUE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.WHITE,  symbol: [SYMBOL.BRIDGE,   SYMBOL.NONE, SYMBOL.STATUE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.BLUE,   symbol: [SYMBOL.FOUNTAIN, SYMBOL.NONE, SYMBOL.BRIDGE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.BLUE,   symbol: [SYMBOL.FOUNTAIN, SYMBOL.NONE, SYMBOL.STAIR,  SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.BLUE,   symbol: [SYMBOL.STAIR,    SYMBOL.NONE, SYMBOL.STATUE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.BLUE,   symbol: [SYMBOL.BRIDGE,   SYMBOL.NONE, SYMBOL.STATUE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.RED,    symbol: [SYMBOL.FOUNTAIN, SYMBOL.NONE, SYMBOL.BRIDGE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.RED,    symbol: [SYMBOL.FOUNTAIN, SYMBOL.NONE, SYMBOL.STATUE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.RED,    symbol: [SYMBOL.STAIR,    SYMBOL.NONE, SYMBOL.STATUE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.RED,    symbol: [SYMBOL.STAIR,    SYMBOL.NONE, SYMBOL.BRIDGE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.YELLOW, symbol: [SYMBOL.FOUNTAIN, SYMBOL.NONE, SYMBOL.BRIDGE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.YELLOW, symbol: [SYMBOL.FOUNTAIN, SYMBOL.NONE, SYMBOL.STATUE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.YELLOW, symbol: [SYMBOL.STAIR,    SYMBOL.NONE, SYMBOL.STATUE, SYMBOL.NONE]},
    {layer: LAYER.CLAY, flower: FLOWER.YELLOW, symbol: [SYMBOL.STAIR,    SYMBOL.NONE, SYMBOL.BRIDGE, SYMBOL.NONE]},
]);
export const CARD_LIST_2 = Object.freeze([
    {layer: LAYER.GRANITE, flower: FLOWER.WHITE,  symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE,   SYMBOL.STATUE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.WHITE,  symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR,    SYMBOL.BRIDGE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.WHITE,  symbol: [SYMBOL.BRIDGE,   SYMBOL.STATUE,   SYMBOL.STAIR,    SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.WHITE,  symbol: [SYMBOL.STATUE,   SYMBOL.STAIR,    SYMBOL.FOUNTAIN, SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.BLUE,   symbol: [SYMBOL.FOUNTAIN, SYMBOL.STATUE,   SYMBOL.STATUE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.BLUE,   symbol: [SYMBOL.STAIR,    SYMBOL.BRIDGE,   SYMBOL.FOUNTAIN, SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.BLUE,   symbol: [SYMBOL.STATUE,   SYMBOL.STAIR,    SYMBOL.BRIDGE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.BLUE,   symbol: [SYMBOL.STATUE,   SYMBOL.BRIDGE,   SYMBOL.FOUNTAIN, SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.RED,    symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE,   SYMBOL.STAIR,    SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.RED,    symbol: [SYMBOL.BRIDGE,   SYMBOL.STAIR,    SYMBOL.STATUE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.RED,    symbol: [SYMBOL.STATUE,   SYMBOL.FOUNTAIN, SYMBOL.BRIDGE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.RED,    symbol: [SYMBOL.STAIR,    SYMBOL.FOUNTAIN, SYMBOL.STATUE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.YELLOW, symbol: [SYMBOL.BRIDGE,   SYMBOL.FOUNTAIN, SYMBOL.STATUE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.YELLOW, symbol: [SYMBOL.BRIDGE,   SYMBOL.STATUE,   SYMBOL.STAIR,    SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.YELLOW, symbol: [SYMBOL.STAIR,    SYMBOL.FOUNTAIN, SYMBOL.BRIDGE,   SYMBOL.NONE]},
    {layer: LAYER.GRANITE, flower: FLOWER.YELLOW, symbol: [SYMBOL.STATUE,   SYMBOL.STAIR,    SYMBOL.FOUNTAIN, SYMBOL.NONE]},
]);
export const CARD_LIST_3 = Object.freeze([
    {layer: LAYER.BASALT, flower: FLOWER.WHITE,  symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE, SYMBOL.STATUE, SYMBOL.STAIR]},
    {layer: LAYER.BASALT, flower: FLOWER.WHITE,  symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE, SYMBOL.STATUE, SYMBOL.STAIR]},
    {layer: LAYER.BASALT, flower: FLOWER.WHITE,  symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR, SYMBOL.STATUE, SYMBOL.BRIDGE]},
    {layer: LAYER.BASALT, flower: FLOWER.WHITE,  symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR, SYMBOL.BRIDGE, SYMBOL.STATUE]},
    {layer: LAYER.BASALT, flower: FLOWER.BLUE,   symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE, SYMBOL.STATUE, SYMBOL.STAIR]},
    {layer: LAYER.BASALT, flower: FLOWER.BLUE,   symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE, SYMBOL.STATUE, SYMBOL.STAIR]},
    {layer: LAYER.BASALT, flower: FLOWER.BLUE,   symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR, SYMBOL.STATUE, SYMBOL.BRIDGE]},
    {layer: LAYER.BASALT, flower: FLOWER.BLUE,   symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR, SYMBOL.BRIDGE, SYMBOL.STATUE]},
    {layer: LAYER.BASALT, flower: FLOWER.RED,    symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE, SYMBOL.STATUE, SYMBOL.STAIR]},
    {layer: LAYER.BASALT, flower: FLOWER.RED,    symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE, SYMBOL.STATUE, SYMBOL.STAIR]},
    {layer: LAYER.BASALT, flower: FLOWER.RED,    symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR, SYMBOL.STATUE, SYMBOL.BRIDGE]},
    {layer: LAYER.BASALT, flower: FLOWER.RED,    symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR, SYMBOL.BRIDGE, SYMBOL.STATUE]},
    {layer: LAYER.BASALT, flower: FLOWER.YELLOW, symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE, SYMBOL.STATUE, SYMBOL.STAIR]},
    {layer: LAYER.BASALT, flower: FLOWER.YELLOW, symbol: [SYMBOL.FOUNTAIN, SYMBOL.BRIDGE, SYMBOL.STATUE, SYMBOL.STAIR]},
    {layer: LAYER.BASALT, flower: FLOWER.YELLOW, symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR, SYMBOL.STATUE, SYMBOL.BRIDGE]},
    {layer: LAYER.BASALT, flower: FLOWER.YELLOW, symbol: [SYMBOL.FOUNTAIN, SYMBOL.STAIR, SYMBOL.BRIDGE, SYMBOL.STATUE]},
]);






