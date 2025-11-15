import { BabylonDataType } from "../types/BabylonTypes";
import { getCurrentTime, isObject } from "./CommonUtils";

export const logger = {
  log: (...args: any[]) => console.log(`[${getCurrentTime()}]`, ...args),
  info: (...args: any[]) => console.log(`[${getCurrentTime()}]`, "ℹ️ ", ...args),
  warn: (...args: any[]) => console.warn(`[${getCurrentTime()}]`, "⚠️ ", ...args),
  error: (...args: any[]) => console.error(`[${getCurrentTime()}]`, "❌ ", ...args),
  debug: (...args: any[]) => console.debug(`[${getCurrentTime()}]`, ...args),
  
  // バビロンのデータを出力
  logBabylonData: (data: BabylonDataType) => {
    return
    try {
      console.log("////////////////////////////////////////////////////////////")
      console.log("[*** Room Info ***]")
      console.log("  - roomId:", data.roomId)
      console.log("  - roomStatus:", data.roomStatus)
      console.log("  - logs(latest):", data.logs.length > 0 ? data.logs[0] : [])
      console.log("  - chat(latest):", data.chat.length > 0 ? data.chat[data.chat.length] : [])
      console.log("[*** Game Info ***]")
      console.log("  - playerIndex:", data.playerIndex)
      console.log("  - playerIds:", data.playerIds?.join(" | "))
      console.log("  - phase:", data.phase)
      console.log("  - round:", data.round)
      // console.log("  - quarry:", data.quarry)
      console.log("  - removeQuarry:", data.removeQuarry)
      console.log("[*** User Info Map ***]")
      if (isObject(data.userInfoMap)) {
        Object.entries(data.userInfoMap).map(([userId, userInfo]) => {
          console.log(`  [--- ${userInfo.userName} - ${userId} ---]`)
          console.log("    - userName:", userInfo.userName)
          console.log("    - color:", userInfo.color)
          console.log("    - icon:", userInfo.icon)
          console.log("    - auth:", userInfo.auth)
          console.log("    - online:", userInfo.online)
          console.log("    - logs(latest):", userInfo.logs.length > 0 ? userInfo.logs[0] : [])
        })
      }
      console.log("[*** Player Info Map ***]")
      if (isObject(data.playerInfoMap)) {
        console.log("  keys:", Object.keys(data.playerInfoMap).join(", "))
        Object.entries(data.playerInfoMap).map(([playerId, playerInfo]) => {
          console.log(`  [--- ${data.userInfoMap[playerId].userName} - ${playerId} ---]`)
          console.log("    - flower:", playerInfo.flower)
          console.log("    - pillar:", playerInfo.pillar)
          if (playerInfo.storageTiles.length == 0) {
            console.log("    - storage: []")
          } else {
            console.log("    - storage:")
            if (playerInfo.storageTiles.length > 0) {
              console.log("      [0]:")
              console.log("        - tileNo:", playerInfo.storageTiles[0].tileNo)
              console.log("        - layer:", playerInfo.storageTiles[0].layer)
              console.log("        - flower:", playerInfo.storageTiles[0].flower)
              console.log("        - symbols:", playerInfo.storageTiles[0].symbols.join(" | "))
            }
            if (playerInfo.storageTiles.length > 1) {
              console.log("      [1]:")
              console.log("        - tileNo:", playerInfo.storageTiles[1].tileNo)
              console.log("        - layer:", playerInfo.storageTiles[1].layer)
              console.log("        - flower:", playerInfo.storageTiles[1].flower)
              console.log("        - symbols:", playerInfo.storageTiles[1].symbols.join(" | "))
            }
            console.log("        - previewPillarMap:", Object.entries(playerInfo.previewPillarMap).map(([k, v])=>`${k}: ${v}`).join(" | "))
            console.log("        - selectedPillarMap:", Object.keys(playerInfo.selectedPillarMap).join(" | "))
            console.log("        - confirmedPillarMap:", Object.keys(playerInfo.confirmedPillarMap).join(" | "))
            console.log("        - previewTileMap:", Object.entries(playerInfo.previewTileMap).map(([p,v])=>`${p}: ${v}`).join(" | "))
            console.log("        - selectedTileMap:", Object.keys(playerInfo.selectedTileMap).join(" | "))
            console.log("        - confirmedTileMap(display):", Object.entries(playerInfo.confirmedTileMap).filter(([_, info])=>info.display).map(([pos,_])=>pos).join(" | "))
            console.log("        - confirmedTileMap(other):", Object.entries(playerInfo.confirmedTileMap).filter(([_, info])=>!info.display).map(([pos,_])=>pos).join(" | "))
            console.log("        - previewComponentMap:", Object.entries(playerInfo.previewComponentMap).map(([p,v])=>`${p}: ${v?.symbol}`).join(" | "))
            console.log("        - selectedComponentMap:", Object.entries(playerInfo.selectedComponentMap).map(([p,v])=>`${p}: ${v?.symbol}`).join(" | "))
            console.log("        - confirmedComponentMap(display):", Object.entries(playerInfo.confirmedComponentMap).filter(([_, info])=>info.display).map(([pos,_])=>pos).join(" | "))
            console.log("        - confirmedComponentMap(other):", Object.entries(playerInfo.confirmedComponentMap).filter(([_, info])=>!info.display).map(([pos,_])=>pos).join(" | "))
          }
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
};
