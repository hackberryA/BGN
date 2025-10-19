import { USERID_KEY } from "../../../const/const";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { BabylonCanvas } from "../BabylonCanvas";


export const PlayerBoardCanvas = () => {
    const {send, roomInfo, gameInfo, userInfoMap, playerInfoMap, userLength, playerLength} = useBabylonWebSocket();
    const clientInfo = userInfoMap[localStorage.getItem(USERID_KEY)!]
    return <>
        <div className="col s7">
            <div id="wrapper-canvas" className="col s9 border3 valign-wrapper center p0" style={{aspectRatio: "1/1", position: "relative"}}>
                <span style={{position: "absolute", left:"3px", top:"0px", zIndex:10}}>You</span>
                <span style={{position: "absolute", right:"3px", top:"0px", zIndex:10}}>♜♜</span>
                <img src="/images/500.png" className="border1 stock-tile-main" style={{zIndex:10}} />
                {roomInfo.status === "waiting" && "ここにプレイヤーボードを描画"}
                {roomInfo.status !== "waiting" && <BabylonCanvas playerId="test" />}
            </div>
            <div className="col s3" style={{aspectRatio: "1/1"}}>
                <OtherPlayerBoardCanvas />
                <OtherPlayerBoardCanvas />
                <OtherPlayerBoardCanvas />
            </div>
        </div>
    </>
}

const OtherPlayerBoardCanvas = () => {
    return <>
        <div className="col s12 p0 border1" style={{aspectRatio: "1/1", position: "relative", marginBottom: "10px"}}>
            <img src="/images/500.png" className="responsive-img" />
            <span style={{position: "absolute", left:"3px", top:"0px"}}>playerA</span>
            <span style={{position: "absolute", right:"3px", top: "0px"}}>♜♜♜</span>
            <img src="/images/500.png" className="border1 stock-tile-sub" />
        </div>
    </>
}