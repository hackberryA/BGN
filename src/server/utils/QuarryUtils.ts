import { TerraceTileInfo } from "../types/BabylonTypes";

const TERRACE_TILES_CLAY = [
    // 噴水、橋
    {layer: "clay", flower: "white", symbols: ["fountain", "empty", "bridge", "empty"]},
    {layer: "clay", flower: "blue", symbols: ["fountain", "empty", "bridge", "empty"]},
    {layer: "clay", flower: "red", symbols: ["fountain", "empty", "bridge", "empty"]},
    {layer: "clay", flower: "yellow", symbols: ["fountain", "empty", "bridge", "empty"]},
    // 階段、彫像
    {layer: "clay", flower: "white", symbols: ["stairway", "empty", "statue", "empty"]},
    {layer: "clay", flower: "blue", symbols: ["stairway", "empty", "statue", "empty"]},
    {layer: "clay", flower: "red", symbols: ["stairway", "empty", "statue", "empty"]},
    {layer: "clay", flower: "yellow", symbols: ["stairway", "empty", "statue", "empty"]},
    // 噴水、階段
    {layer: "clay", flower: "white", symbols: ["fountain", "empty", "stairway", "empty"]},
    {layer: "clay", flower: "blue", symbols: ["fountain", "empty", "stairway", "empty"]},
    // 橋、彫像
    {layer: "clay", flower: "white", symbols: ["bridge", "empty", "statue", "empty"]},
    {layer: "clay", flower: "blue", symbols: ["bridge", "empty", "statue", "empty"]},
    // 噴水、彫像
    {layer: "clay", flower: "red", symbols: ["fountain", "empty", "statue", "empty"]},
    {layer: "clay", flower: "yellow", symbols: ["fountain", "empty", "statue", "empty"]},
    // 階段、橋
    {layer: "clay", flower: "red", symbols: ["stairway", "empty", "bridge", "empty"]},
    {layer: "clay", flower: "yellow", symbols: ["stairway", "empty", "bridge", "empty"]},
]
const TERRACE_TILES_GRANITE = [
    {layer: "granite", flower: "white", symbols: ["fountain", "bridge", "statue", "empty"]},
    {layer: "granite", flower: "white", symbols: ["fountain", "stairway", "bridge", "empty"]},
    {layer: "granite", flower: "red", symbols: ["fountain", "bridge", "stairway", "empty"]},
    {layer: "granite", flower: "blue", symbols: ["fountain", "statue", "stairway", "empty"]},
    {layer: "granite", flower: "white", symbols: ["bridge", "statue", "stairway", "empty"]},
    {layer: "granite", flower: "yellow", symbols: ["bridge", "statue", "stairway", "empty"]},
    {layer: "granite", flower: "red", symbols: ["bridge", "stairway", "statue", "empty"]},
    {layer: "granite", flower: "yellow", symbols: ["bridge", "fountain", "statue", "empty"]},
    {layer: "granite", flower: "red", symbols: ["stairway", "fountain", "statue", "empty"]},
    {layer: "granite", flower: "yellow", symbols: ["stairway", "fountain", "bridge", "empty"]},
    {layer: "granite", flower: "blue", symbols: ["stairway", "bridge", "fountain", "empty"]},
    {layer: "granite", flower: "blue", symbols: ["statue", "stairway", "bridge", "empty"]},
    {layer: "granite", flower: "white", symbols: ["statue", "stairway", "fountain", "empty"]},
    {layer: "granite", flower: "yellow", symbols: ["statue", "stairway", "fountain", "empty"]},
    {layer: "granite", flower: "red", symbols: ["statue", "fountain", "bridge", "empty"]},
    {layer: "granite", flower: "blue", symbols: ["statue", "bridge", "fountain", "empty"]},
]
const TERRACE_TILES_BASALT = [
    {layer: "basalt", flower: "white", symbols: ["fountain", "bridge", "statue", "stairway"]},
    {layer: "basalt", flower: "white", symbols: ["fountain", "bridge", "statue", "stairway"]},
    {layer: "basalt", flower: "white", symbols: ["fountain", "stairway", "statue", "bridge"]},
    {layer: "basalt", flower: "white", symbols: ["fountain", "stairway", "bridge", "statue"]},
    {layer: "basalt", flower: "blue", symbols: ["fountain", "bridge", "statue", "stairway"]},
    {layer: "basalt", flower: "blue", symbols: ["fountain", "bridge", "statue", "stairway"]},
    {layer: "basalt", flower: "blue", symbols: ["fountain", "stairway", "statue", "bridge"]},
    {layer: "basalt", flower: "blue", symbols: ["fountain", "stairway", "bridge", "statue"]},
    {layer: "basalt", flower: "red", symbols: ["fountain", "bridge", "statue", "stairway"]},
    {layer: "basalt", flower: "red", symbols: ["fountain", "bridge", "statue", "stairway"]},
    {layer: "basalt", flower: "red", symbols: ["fountain", "stairway", "statue", "bridge"]},
    {layer: "basalt", flower: "red", symbols: ["fountain", "stairway", "bridge", "statue"]},
    {layer: "basalt", flower: "yellow", symbols: ["fountain", "bridge", "statue", "stairway"]},
    {layer: "basalt", flower: "yellow", symbols: ["fountain", "bridge", "statue", "stairway"]},
    {layer: "basalt", flower: "yellow", symbols: ["fountain", "stairway", "statue", "bridge"]},
    {layer: "basalt", flower: "yellow", symbols: ["fountain", "stairway", "bridge", "statue"]},
]

// ランダムpop
export function popRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  // spliceで削除しつつ取り出す
  const [removed] = arr.splice(index, 1);
  return removed;
}
export const getRandomQuarry = () => {
    const clay = TERRACE_TILES_CLAY.map(v=>({...v}))
    const granite = TERRACE_TILES_GRANITE.map(v=>({...v}))
    const basalt = TERRACE_TILES_BASALT.map(v=>({...v}))
    const result = []
    for (let i = 0; i < 16; i++) {
        // [粘土タイル, 花崗岩タイル, 玄武岩タイル]
        result.push([
            {...popRandom(clay), display: true, rotate: 0, tileNo: -1},
            {...popRandom(granite), display: true, rotate: 0, tileNo: -1},
            {...popRandom(basalt), display: true, rotate: 0, tileNo: -1},
        ])
    }
    return result as TerraceTileInfo[][]
}