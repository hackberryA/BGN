import { useEffect } from "react";
import { USERID_KEY } from "../../const/const";
import { useBabylonWebSocket } from "../../hooks/useBabylonWebSocket";

const Message = () => {
    const {send, roomInfo, gameInfo, playerInfoMap, userInfoMap} = useBabylonWebSocket();
    const sendHandler = (msgType: string) => () => send(msgType);

    const userId = localStorage.getItem(USERID_KEY)!;
    const playerLength = gameInfo.playerIds.length
    // プレイ中ユーザ
    const playingUserId = gameInfo.playerIds[gameInfo.playerIndex];
    const playingUserName = userInfoMap[playingUserId]?.userName;
    return (
        <div className="row">
            <div className="col s12 yellow lighten-3 valign-wrapper center" style={{height: "35px", width: "100%" }} >
                {/* ゲーム待機中 */}
                {roomInfo.status === "waiting" && (<>
                    {gameInfo.playerIds.includes(userId)
                        ? <MessageButton clickHandle={sendHandler("notJoinGame")} msg="開始待機中" name="やっぱやめる"  />
                        : 
                            playerLength < 4
                                ? <MessageButton clickHandle={sendHandler("joinGame")} msg="開始待機中" name="ゲームに参加する" />
                                : <MessageButton clickHandle={()=>{}} msg="開始待機中" name="満席です" disabled />
                    }
                    {userInfoMap[userId]?.auth &&
                        <MessageButton clickHandle={sendHandler("startGame")} name="ゲーム開始" color="blue" disabled={playerLength == 0} />}
                    <span style={{paddingLeft: "10px", fontSize: "10px", color: "grey"}}>(プレイ順はシャッフルされます)</span>
                </>)}
                {/* ゲーム中 */}
                {roomInfo.status === "progress" && (<>
                    {userId === playingUserId
                        // プレイ中
                        ?<MessageButton clickHandle={sendHandler("removeTile")} name="確定"/>
                        // 待機中
                        :<h6 className="center-align m0" style={{lineHeight: "35px"}}><span className="player-name">{playingUserName}</span>がプレイ中です。</h6>
                    }
                </>)}
                
            </div>
        </div>
    )
}
export default Message


type MessageButtonType = {msg?: string, name: string, clickHandle: () => void, color?: string, disabled?: boolean}
const MessageButton = ({msg="", name, clickHandle, color="green", disabled=false}: MessageButtonType) => {
    return <>
        <h6 className="center-align m0" style={{lineHeight: "35px"}}>{msg}</h6>
        <button className={`btn waves-effect waves-light btn-small ${color} darken-1`} style={{marginLeft: "10px"}} onClick={clickHandle} disabled={disabled}>{name}</button>
    </>
}