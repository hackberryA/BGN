import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { useStorage } from "../../../hooks/useStorage";


export const QuarryCanvas = () => {
    const {send, roomInfo, gameInfo, userInfoMap, playerInfoMap, userLength, playerLength} = useBabylonWebSocket();
    const storage = useStorage()
    const clientInfo = userInfoMap[storage.userId]
    return <>
            <div className="col s3">
            <div className="col s12 border2 valign-wrapper center"
                style={{aspectRatio: "1/1", position: "relative"}}>
                <span style={{position: "absolute", left:"3px", top:"0px"}}>Quarry</span>
                ここに採掘場を描画
                {/* <canvas id="main"></canvas> */}
                <span>
                    
                </span>
            </div>
            <div className="col s12 border1 p0" style={{marginTop: "10px"}}>
                <div id="room-log-title" className="m0" style={{fontSize: "10px", lineHeight: 1.5, paddingLeft: "5px", backgroundColor: "#aedaec"}}>全体ログ</div>
                <ul id="room-log" className="m0" style={{height: "120px", overflowY: "scroll", fontSize: "10px", lineHeight: 1.5}}>
                    {roomInfo && roomInfo.logs.map(({time, content}, index) => 
                        <li style={{padding: "0 5px", lineHeight: 1.6}} key={index}>
                            [{time}] {content}
                        </li>
                    )}
                </ul>
            </div>
            <div className="col s12 border1 p0" style={{marginTop: "10px"}}>
                <div id="client-log-title" className="m0" style={{fontSize: "10px", lineHeight: 1.5, paddingLeft: "5px", backgroundColor: "#aedaec"}}>個人ログ</div>
                <ul id="client-log" className="m0" style={{height: "80px", overflowY: "scroll", fontSize: "10px", lineHeight: 1.5}}>
                    {clientInfo && clientInfo.logs.map(({time, content}, index) => 
                        <li style={{padding: "0 5px", lineHeight: 1.6}} key={index}>
                            [{time}] {content}
                        </li>
                    )}
                </ul>
            </div>
            <div style={{fontSize: "8px", color: "skyblue", right:"2px"}} aria-autocomplete="none">
                閲覧 ({userLength}人)<br/>
                参加 ({playerLength}人) {gameInfo.playerIds.map((id)=>userInfoMap[id].userName + ", ")}
            </div>
        </div>
    </>
}