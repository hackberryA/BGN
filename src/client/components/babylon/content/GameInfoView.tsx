import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";

export const GameInfoView = () => {
    const {send, roomInfo, gameInfo, userInfoMap, playerInfoMap, userLength, playerLength} = useBabylonWebSocket();
    return <>
    {/* Game Info */}
    <div className="collection-item light-blue lighten-5">
        <div className="card-content" style={{padding: "10px 12px", fontSize: "50%"}}>
            <table>
                <tbody>
                    <tr><td>ルームID</td><td>{roomInfo.roomId}</td></tr>
                    <tr><td>ステータス</td><td>{roomInfo.status}</td></tr>
                    <tr><td>現在プレイヤー</td><td>{gameInfo.playerIndex}</td></tr>
                    <tr><td>順番</td><td>{gameInfo.playerIds.map(id=>userInfoMap[id].userName).join(", ")}</td></tr>
                    <tr><td>ラウンド</td><td>{gameInfo.round}</td></tr>
                    <tr><td>フェーズ</td><td>{gameInfo.phase}</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    {/* Player Info */}
    <div className="row s3 light-blue lighten-5">
        <ul className="collection" style={{marginBottom: 0}}>
            {gameInfo.playerIds.map((userId, index) => 
                <li className="collection-item" key={index} style={{position: "relative"}}>
                    player{index+1}： <span style={{color: userInfoMap[userId].color, fontWeight: "bold"}}>
                        {userInfoMap[userId].userName}
                    </span>
                    <span className="online" style={{ backgroundColor: userInfoMap[userId].online ? "lightgreen" : "white" }} />
                </li>
            )}
            {playerLength < 1 && <li className="collection-item">player1：</li>}
            {playerLength < 2 && <li className="collection-item">player2：</li>}
            {playerLength < 3 && <li className="collection-item">player3：</li>}
            {playerLength < 4 && <li className="collection-item">player4：</li>}
        </ul>
    </div>
    </>
}