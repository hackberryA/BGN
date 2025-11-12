import { useState } from "react"
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket"
import { QuarryTile } from "./QuarryTile";


export const DebugInfo = () => {
    const [hide, setHide] = useState(true)
    const {data, userLength, playerLength} = useBabylonWebSocket();
    const [selectedUserId, setSelectedUserId] = useState(Object.keys(data.userInfoMap)[0])
    const [selectedPlayerId, setSelectedPlayerId] = useState(Object.keys(data.userInfoMap)[0])

    return <div className="row debug-info-wrapper" >
        <div className="right debug-info-button" onClick={()=>setHide(!hide)}>[debug info]</div>
        {!hide && <div className="row debug-info">
            <div className="col s4">
                <table>
                    <tbody>
                        <tr><th colSpan={3}>RoomInfo</th></tr>
                        <InfoRow name="roomId" name2="部屋ID" value={data.roomId} />
                        <InfoRow name="roomStatus" name2="ステータス" value={data.roomStatus} />
                        <InfoRow name="logs (latest)" name2="ログ" value={data.logs[0]?.content} />
                        <InfoRow name="chat (latest)" name2="チャット" value={data.chat[data.chat.length-1]?.content} />
                        <InfoRow name="playerIds" name2="プレイ順" value={data.playerIds.map(v=>data.userInfoMap[v]?.userName).join(" > ")} />
                        <InfoRow name="playerIndex" name2="現在プレイヤー" value={data.userInfoMap[data.playerIds[data.playerIndex]]?.userName} />
                        <InfoRow name="userLength" name2="接続者数" value={userLength} />
                        <InfoRow name="playerLength" name2="プレイヤー数" value={playerLength} />
                        <InfoRow name="removeQuarry" name2="除外残数" value={data.removeQuarry} />
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr><th colSpan={3}>Quarry</th></tr>
                        <tr>
                            {[0,1,2].map(index=>
                            <td>
                                layer {index+1}<br/>
                                <div className="col s12 border2 valign-wrapper center quarry"
                                        style={{aspectRatio: "1/1", position: "relative", backgroundColor: "black"}}>
                                    {data.quarry.map((v,i)=>
                                        <QuarryTile 
                                            key={`debug-info-quarry-tile-${i}`}
                                            layer={v[index].layer}
                                            flower={v[index].flower}
                                            symbols={v[index].symbols}
                                            style={{opacity: v[index].display ? 1 : .2}}
                                        />)}
                                </div>
                            </td>
                            )}
                        </tr>
                    </tbody>
                </table>
                <div className="row">
                {Object.entries(data.userInfoMap).map(([userId, userInfo])=>{
                    return <div 
                        key={`debug-userInfo-${userId}`}
                        className={`user-icon ${userId === selectedUserId && "selected"}`}
                        onClick={()=>setSelectedUserId(userId)}
                        >
                        <img src={`/images/icons/${userInfo.icon ?? "default"}.png`}/>
                    </div>
                })}
                </div>
                <table>
                    <tbody>
                        <tr><th colSpan={3}>UserInfo</th></tr>
                        {data.userInfoMap[selectedUserId] ? <>
                            <InfoRow name="userName" name2="ユーザ名" value={data.userInfoMap[selectedUserId]?.userName} />
                            <InfoRow name="color" name2="表示色" value={data.userInfoMap[selectedUserId]?.color} />
                            <InfoRow name="icon" name2="アイコン" value={data.userInfoMap[selectedUserId]?.icon} />
                            <InfoRow name="auth" name2="ルーム長" value={data.userInfoMap[selectedUserId]?.auth? "true" : "false"} />
                            <InfoRow name="online" name2="接続" value={data.userInfoMap[selectedUserId]?.online ? "true" : "false"} />
                        </> : ""}
                    </tbody>
                </table>
            </div>
            {/* プレイヤー情報 */}
            <div className="col s1">
                <div className="right" style={{display: "grid"}}>
                    {Object.keys(data.playerInfoMap).map((playerId)=>{
                        const userInfo = data.userInfoMap[playerId]
                        return <div
                            key={`debug-playerInfo-${playerId}`}
                            className={`user-icon ${playerId === selectedPlayerId && "selected"}`}
                            onClick={()=>setSelectedPlayerId(playerId)}>
                            <img src={`/images/icons/${userInfo.icon ?? "default"}.png`}/>
                        </div>
                    })}
                </div>
            </div>
            <div className="col s6">
                <table>
                    <tbody>
                        <tr><th colSpan={3}>PlayerInfo</th></tr>
                        {data.playerInfoMap[selectedPlayerId] ? <>
                            <InfoRow name="flower" name2="花" value={data.playerInfoMap[selectedPlayerId]?.flower} />
                            <InfoRow name="pillar" name2="柱(所持数)" value={data.playerInfoMap[selectedPlayerId]?.pillar} />
                            <InfoRow name="selectTarget" name2="設置対象" value={data.playerInfoMap[selectedPlayerId]?.selectTarget} />
                            <tr>
                                <td colSpan={3}>
                                    <b>ストレージ</b>{data.playerInfoMap[selectedPlayerId]?.storageTiles.length == 0 && "：なし"}
                                    {data.playerInfoMap[selectedPlayerId]?.storageTiles.map(tileInfo=>
                                        <table>
                                            <tbody>
                                                <InfoRow name="tileNo" name2="タイル番号" value={tileInfo.tileNo} />
                                                <InfoRow name="layer" name2="地層" value={tileInfo.layer} />
                                                <InfoRow name="flower" name2="花" value={tileInfo.flower} />
                                                <InfoRow name="symbols" name2="シンボル" value={tileInfo.symbols.join(" | ")} />
                                                <InfoRow name="display" name2="表示／非表示" value={tileInfo.display ? "true" : "false"} />
                                            </tbody>
                                        </table>
                                    )}
                                </td>
                            </tr>
                            {/**********************************************************************************************************/}
                            <tr><th>柱</th></tr>
                            <tr>
                                <td colSpan={3}>
                                    [確定済]<br/>
                                    {Object.entries(data.playerInfoMap[selectedPlayerId]?.confirmedPillarMap).map(([k,v])=> `(${k}): ${v}`).join(" | ")}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    [選択中]<br/>
                                    {Object.entries(data.playerInfoMap[selectedPlayerId]?.selectedPillarMap).map(([k,v])=> `(${k}): ${v}`).join(" | ")}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    [設置可能座標]<br/>
                                    {Object.entries(data.playerInfoMap[selectedPlayerId]?.previewPillarMap).filter(([_,v])=> v).map(([k,_])=>k).join(" | ")}
                                </td>
                            </tr>
                            {/**********************************************************************************************************/}
                            <tr><th>テラスタイル</th></tr>
                            <tr>
                                <td colSpan={3}>
                                    [確定済]<br/>
                                    {Object.entries(data.playerInfoMap[selectedPlayerId]?.confirmedTileMap).map(([k,_])=> `(${k})`).join(" | ")}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    [選択中]
                                    {Object.entries(data.playerInfoMap[selectedPlayerId]?.selectedTileMap).map(([k,_])=> `(${k})`).join(" | ")}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    [設置可能座標]
                                    {Object.entries(data.playerInfoMap[selectedPlayerId]?.previewTileMap).filter(([_,v])=> v).map(([k,_])=>k).join(" | ")}
                                </td>
                            </tr>
                            <tr><th>コンポーネント</th></tr>
                                {Object.entries(data.playerInfoMap[selectedPlayerId]?.confirmedComponentMap).map(([pos,info])=>
                                <tr>
                                    <td>[{pos}] symbol: {info.symbol}</td>
                                    <td>direction: {info.direction}</td>
                                    <td>display: {info.display ? "true" : "false"}</td>
                                </tr>
                                )}
                        </> : ""}
                    </tbody>
                </table>
            </div>
        </div>}
    </div>
}
type RowProps = {name:string, name2?:string, value?: any, remarks?: string}
const InfoRow = ({name, name2, value, remarks}: RowProps) => {
    return <tr>
        <td>{name2}</td>
        <td>{name}</td>
        <td>{value}</td>
        {/* <td>{remarks}</td> */}
    </tr>
}