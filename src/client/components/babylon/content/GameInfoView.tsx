import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { PHASE } from "../const/phase";
import { CurrentPlayerName, PlayerName } from "./PlayerName";



export const GameInfoView = () => {
    const {send, data, userLength, playerLength} = useBabylonWebSocket();
    return <>
        {/* Game Info */}
        <div className="collection-item light-blue lighten-5">
            <div className="card-content" style={{padding: "10px 12px", fontSize: "50%"}}>
                <table>
                    <tbody>
                        {/* <tr><td>ルームID</td><td>{data.roomId}</td></tr> */}
                        {/* <tr><td>ステータス</td><td>{data.roomStatus}</td></tr> */}
                        <tr><td>フェーズ</td><td><b>{PHASE[data.phase]}</b></td></tr>
                        <tr><td>現在プレイヤー</td><td><CurrentPlayerName /></td></tr>
                        {/* <tr><td>順番</td><td>{data.playerIds.map(id=>data.userInfoMap[id].userName).join(", ")}</td></tr> */}
                        <tr><td>ラウンド</td><td>{data.round == 0 ? "" : data.round}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        {/* Player Info */}
        <div className="row s3">
            <ul className="player-info-list" style={{marginBottom: 0, position: "relative"}}>
                {data.playerIds.map((userId, index) => {
                    const userInfo = data.userInfoMap[userId];
                    const playerInfo = data.playerInfoMap[userId];
                    return <li className="player-info" key={index} style={{position: "relative"}}>
                        <div className="player-info-user-info">
                            <div className="user-icon" style={{cursor: "default", left: "5px", top: "4px"}}>
                                <img src={`/images/icons/${userInfo.icon ?? "default"}.png`}/>
                            </div>
                            <PlayerName userId={userId} />
                            <span className="online" style={{ backgroundColor: userInfo.online ? "lightgreen" : "white" }} />
                        </div>
                        <div className="player-info-game-info">
                            {playerInfo && <div className="flower-icon">
                                <img src={`/images/babylon/flowers/${playerInfo.flower}.png`}/>
                            </div>}
                        </div>
                    </li>
                })}
                {playerLength < 1 && <li className="collection-item">　</li>}
                {playerLength < 2 && <li className="collection-item">　</li>}
                {playerLength < 3 && <li className="collection-item">　</li>}
                {playerLength < 4 && <li className="collection-item">　</li>}
            </ul>
        </div>
    </>
}