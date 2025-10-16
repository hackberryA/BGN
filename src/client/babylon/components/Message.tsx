import { BabylonRoomData, useBabylonRoomData } from "../../hooks/useBabylonRoomData";
import { useSocketContext } from "../../hooks/useWebSocket.tsx";

type MessageType = {roomData: BabylonRoomData}
const Message = ({roomData}: MessageType) => {
    const { send } = useSocketContext();
    return (
        <div className="row">
            <div className="col s12 yellow lighten-3 valign-wrapper center" style={{height: "35px", width: "100%" }} >
                {roomData.status === "waiting" && <MessageButton msg="参加待機中" name="開始" clickHandle={()=>send({type:"start-game"})} />}
            </div>
        </div>
    )
}
export default Message


type MessageButtonType = {msg: string, name: string, clickHandle: () => void}
const MessageButton = ({msg, name, clickHandle}: MessageButtonType) => {
    return <>
        <h6 className="center-align m0" style={{lineHeight: "35px"}}>{msg}</h6>
        <button className="btn waves-effect waves-light btn-small green darken-1" style={{marginLeft: "10px"}} onClick={clickHandle}>{name}</button>
    </>
}