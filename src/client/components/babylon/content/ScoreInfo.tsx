import { useState } from "react"
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket"
import { QuarryTile } from "./QuarryTile";
import { ComponentType } from "../../../types/BabylonTypes";

type ScoreProps = {
    statue: number;
    fountain: number;
    bridge: number;
    stairway: number;
    decoration: {fountain: number, bridge: number, stairway: number, statue: number};
    flower: {red: number, yellow: number, blue: number, white: number};
    belvederes: number;
    highest: number;
}
type SymbolProps = {
    height: number;
    objectNo: number;
    symbol: string;
    score: number;
}

const getSymbolScore = (height: number, info: ComponentType) => {
    return {
        height: height,
        objectNo: info.objectNo,
        symbol: info.symbol,
        score: info.symbol == "fountain" ? height * 3
        : info.symbol == "bridge" ? height * 3
        : info.symbol == "stairway" ? (info.display ? height*2+1 : height*2-1)
        : info.symbol == "statue" ? height
        : 1
    } as SymbolProps
}

export const ScoreInfo = () => {
    const [hide, setHide] = useState(false)
    const {data} = useBabylonWebSocket();
    const scoreList: ScoreProps[] = []
    const symbolLists: {[playerId: string]: {[pos: string]: SymbolProps}} = {};
    data.playerIds.map(playerId=> {
        if (playerId in data.playerInfoMap) {
            const playerInfo = data.playerInfoMap[playerId]
            scoreList.push({ statue: 0, fountain: 0, bridge: 0, stairway: 0, decoration: {fountain: 0, bridge: 0, stairway: 0, statue: 0}, flower: {red: 0, yellow: 0, blue: 0, white: 0}, belvederes: 0, highest: 0, })
            const symbolList: {[pos: string]: SymbolProps} = {};
            for (let y=15;y>=0;y--) { // y: 降順
                for (let x=0;x<8;x++) {
                    for (let z=0;z<8;z++) {
                        if (`${x},${z}` in symbolList) continue;
                        if (y==0) { symbolList[`${x},${z}`] = {height: 0, objectNo: 0, symbol: "empty", score: 0}; continue; }

                        if (`${x},${y},${z}` in playerInfo.confirmedComponentMap) { 
                            symbolList[`${x},${z}`] = getSymbolScore(y, playerInfo.confirmedComponentMap[`${x},${y},${z}`])
                            continue;
                        } else if (`${x},${y},${z},0` in playerInfo.confirmedComponentMap) { 
                            symbolList[`${x},${z}`] = getSymbolScore(y, playerInfo.confirmedComponentMap[`${x},${y},${z},0`])
                            continue;
                        } else if (`${x},${y},${z},1` in playerInfo.confirmedComponentMap) { 
                            symbolList[`${x},${z}`] = getSymbolScore(y, playerInfo.confirmedComponentMap[`${x},${y},${z},1`])
                            continue;
                        } else if (`${x},${y},${z},2` in playerInfo.confirmedComponentMap) { 
                            symbolList[`${x},${z}`] = getSymbolScore(y, playerInfo.confirmedComponentMap[`${x},${y},${z},2`])
                            continue;
                        } else if (`${x},${y},${z},3` in playerInfo.confirmedComponentMap) { 
                            symbolList[`${x},${z}`] = getSymbolScore(y, playerInfo.confirmedComponentMap[`${x},${y},${z},3`])
                            continue;
                        }
                        // タイルが見つかれば以降検索対象外
                        if (`${x},${y},${z}` in playerInfo.confirmedTileMap) {
                            symbolList[`${x},${z}`] = {height: 0, objectNo: 0, symbol: "empty", score: 0};
                            continue;
                        }
                    }
                }
            }
            symbolLists[playerId] = symbolList
        }
    })

    return <div className="row debug-info-wrapper" >
        <div className="right debug-info-button" onClick={()=>setHide(!hide)}>[score info]</div>
        {!hide && <div className="row control-hint">
            {data.playerIds.map((playerId, index)=> {
                return <div className="col s6" key={`score-info-${index}-div`} >
                    <table className="score-canvas">
                        <tbody>
                            {[7,6,5,4,3,2,1,0].map(x=>{
                                return <tr key={`score-info-${index}-${x}-tr`} >
                                    {[0,1,2,3,4,5,6,7].map(z=>{
                                        if (!symbolLists[playerId]) return null;
                                        const symbol = symbolLists[playerId][`${x},${z}`].symbol
                                        const height = symbolLists[playerId][`${x},${z}`].height
                                        const objectNo = symbolLists[playerId][`${x},${z}`].objectNo
                                        const score = symbolLists[playerId][`${x},${z}`].score

                                        if (symbol !== "empty") {
                                            // 前の行とシンボルとNoが同じ場合
                                            if (symbolLists[playerId][`${x+1},${z}`]?.symbol == symbol
                                                && symbolLists[playerId][`${x+1},${z}`]?.objectNo == objectNo) return null
                                            // 前の列とシンボルとNoが同じ場合
                                            if (symbolLists[playerId][`${x},${z-1}`]?.symbol == symbol
                                                && symbolLists[playerId][`${x},${z-1}`]?.objectNo == objectNo) return null
                                        }
                                        // *** 得点計算 ***
                                        if (symbol === "statue") scoreList[index].statue += score;
                                        if (symbol === "fountain") scoreList[index].fountain += score;
                                        if (symbol === "bridge") scoreList[index].bridge += score;
                                        if (symbol === "stairway") scoreList[index].stairway += score;
                                        if (symbol === "belvederes") scoreList[index].belvederes += score;
                                        if (symbol === "fountain" || symbol === "bridge" || symbol === "stairway" || symbol === "statue") {
                                            scoreList[index].decoration[symbol]++;
                                        }
                                        // 最高地点
                                        scoreList[index].highest = Math.max(height * 2, scoreList[index].highest)
                                        


                                        let col = 1;
                                        let row = 1;
                                        // 次の行とシンボルとNoが同じ場合
                                        if (symbol !== "empty") {
                                            if (symbolLists[playerId][`${x-1},${z}`]?.symbol == symbol && symbolLists[playerId][`${x-1},${z}`]?.objectNo == objectNo) {
                                                if (symbolLists[playerId][`${x-2},${z}`]?.symbol == symbol && symbolLists[playerId][`${x-2},${z}`]?.objectNo == objectNo) {
                                                    row = 3
                                                } else {
                                                    row = 2
                                                }
                                            }
                                            if (symbolLists[playerId][`${x},${z+1}`]?.symbol == symbol && symbolLists[playerId][`${x},${z+1}`]?.objectNo == objectNo) {
                                                if (symbolLists[playerId][`${x},${z+2}`]?.symbol == symbol && symbolLists[playerId][`${x},${z+2}`]?.objectNo == objectNo) {
                                                    col = 3
                                                } else {
                                                    col = 2
                                                }
                                            }
                                        }
                                        return <td key={`score-info-${index}-${x}-${z}`} 
                                                colSpan={col} 
                                                rowSpan={row} 
                                                style={{backgroundColor: symbol !== "empty" ? "white" : "#dcedf3ff" }}>
                                            {symbol !== "empty" && <>
                                                <div style={{ backgroundImage: `url(/images/babylon/symbols/${symbol}.png)`, }}></div>
                                                <span>{height}</span>
                                            </>}
                                        </td>
                                    })}
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                }
            )}
            <div className="col s12">
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>条件</th>
                            <th>計算</th>
                            <th>プレイヤー1</th>
                            <th>プレイヤー2</th>
                            <th>プレイヤー3</th>
                            <th>プレイヤー4</th>
                        </tr>
                        <InfoRow value1={scoreList[0]?.statue}     value2={scoreList[1]?.statue}     value3={scoreList[2]?.statue}     value4={scoreList[3]?.statue}     image="score1" name="彫像" scoring="階層" />
                        <InfoRow value1={scoreList[0]?.fountain}   value2={scoreList[1]?.fountain}   value3={scoreList[2]?.fountain}   value4={scoreList[3]?.fountain}   image="score2" name="噴水" scoring="階層 ✖ 3" />
                        <InfoRow value1={scoreList[0]?.bridge}     value2={scoreList[1]?.bridge}     value3={scoreList[2]?.bridge}     value4={scoreList[3]?.bridge}     image="score3" name="橋" scoring="階層 ✖ 3" />
                        <InfoRow value1={scoreList[0]?.stairway}   value2={scoreList[1]?.stairway}   value3={scoreList[2]?.stairway}   value4={scoreList[3]?.stairway}   image="score4" name="階段" scoring="階層の和" />
                        <InfoRow 
                            value1={Math.min(scoreList[0]?.decoration.bridge, scoreList[0]?.decoration.fountain, scoreList[0]?.decoration.stairway, scoreList[0]?.decoration.bridge) * 4} 
                            value2={Math.min(scoreList[1]?.decoration.bridge, scoreList[1]?.decoration.fountain, scoreList[1]?.decoration.stairway, scoreList[1]?.decoration.bridge) * 4} 
                            value3={Math.min(scoreList[2]?.decoration.bridge, scoreList[2]?.decoration.fountain, scoreList[2]?.decoration.stairway, scoreList[2]?.decoration.bridge) * 4} 
                            value4={Math.min(scoreList[3]?.decoration.bridge, scoreList[3]?.decoration.fountain, scoreList[3]?.decoration.stairway, scoreList[3]?.decoration.bridge) * 4} 
                            image="score5" name="装飾セット" scoring=" ✖ 4" />
                        <InfoRow 
                            value1={Math.min(scoreList[0]?.flower.red, scoreList[0]?.flower.yellow, scoreList[0]?.flower.blue, scoreList[0]?.flower.white) * 4} 
                            value2={Math.min(scoreList[1]?.flower.red, scoreList[1]?.flower.yellow, scoreList[1]?.flower.blue, scoreList[1]?.flower.white) * 4} 
                            value3={Math.min(scoreList[2]?.flower.red, scoreList[2]?.flower.yellow, scoreList[2]?.flower.blue, scoreList[2]?.flower.white) * 4} 
                            value4={Math.min(scoreList[3]?.flower.red, scoreList[3]?.flower.yellow, scoreList[3]?.flower.blue, scoreList[3]?.flower.white) * 4} 
                            image="score6" name="お花セット" scoring=" ✖ 4" />
                        <InfoRow value1={scoreList[0]?.belvederes} value2={scoreList[1]?.belvederes} value3={scoreList[2]?.belvederes} value4={scoreList[3]?.belvederes} image="score7" name="展望台" scoring=" ✖ 1" />
                        <InfoRow value1={scoreList[0]?.highest}    value2={scoreList[1]?.highest}    value3={scoreList[2]?.highest}    value4={scoreList[3]?.highest}    image="score8" name="最高地点" scoring=" ✖ 2" />
                        <InfoRow 
                            value1={!scoreList[0] ? 0
                                : scoreList[0].statue + scoreList[0].fountain + scoreList[0].bridge + scoreList[0].stairway + scoreList[0].belvederes + scoreList[0].highest
                                + Math.min(scoreList[0]?.decoration.bridge, scoreList[0]?.decoration.fountain, scoreList[0]?.decoration.stairway, scoreList[0]?.decoration.bridge) * 4
                                + Math.min(scoreList[0]?.flower.red, scoreList[0]?.flower.yellow, scoreList[0]?.flower.blue, scoreList[0]?.flower.white) * 4
                            }
                            value2={!scoreList[1] ? 0
                                : scoreList[1].statue + scoreList[1].fountain + scoreList[1].bridge + scoreList[1].stairway + scoreList[1].belvederes + scoreList[1].highest
                                + Math.min(scoreList[1]?.decoration.bridge, scoreList[1]?.decoration.fountain, scoreList[1]?.decoration.stairway, scoreList[1]?.decoration.bridge) * 4
                                + Math.min(scoreList[1]?.flower.red, scoreList[1]?.flower.yellow, scoreList[1]?.flower.blue, scoreList[1]?.flower.white) * 4
                            }
                            value3={!scoreList[2] ? 0
                                : scoreList[2].statue + scoreList[2].fountain + scoreList[2].bridge + scoreList[2].stairway + scoreList[2].belvederes + scoreList[2].highest
                                + Math.min(scoreList[2]?.decoration.bridge, scoreList[2]?.decoration.fountain, scoreList[2]?.decoration.stairway, scoreList[2]?.decoration.bridge) * 4
                                + Math.min(scoreList[2]?.flower.red, scoreList[2]?.flower.yellow, scoreList[2]?.flower.blue, scoreList[2]?.flower.white) * 4
                            }
                            value4={!scoreList[3] ? 0
                                : scoreList[3].statue + scoreList[3].fountain + scoreList[3].bridge + scoreList[3].stairway + scoreList[3].belvederes + scoreList[3].highest
                                + Math.min(scoreList[3]?.decoration.bridge, scoreList[3]?.decoration.fountain, scoreList[3]?.decoration.stairway, scoreList[3]?.decoration.bridge) * 4
                                + Math.min(scoreList[3]?.flower.red, scoreList[3]?.flower.yellow, scoreList[3]?.flower.blue, scoreList[3]?.flower.white) * 4
                            }
                            name="" scoring="合計" />
                    </tbody>
                </table>
            </div>
        </div>}
    </div>
}
type RowProps = {image?:string, name:string, scoring: string, value1: number, value2: number, value3: number, value4: number}
const InfoRow = ({image, name, scoring, value1, value2, value3, value4}: RowProps) => {
    return <tr>
        <td>{image && <img src={`/images/babylon/score/${image}.png`} style={{width: "40px"}}/>}</td>
        <td>{name}</td>
        <td>{scoring}</td>
        <td style={{textAlign: "center"}}>{value1 > 0 ? value1 : "-"}</td>
        <td style={{textAlign: "center"}}>{value2 > 0 ? value2 : "-"}</td>
        <td style={{textAlign: "center"}}>{value3 > 0 ? value3 : "-"}</td>
        <td style={{textAlign: "center"}}>{value4 > 0 ? value4 : "-"}</td>
    </tr>
}