import { useStorage } from "../../hooks/useStorage";
import { BabylonRoomData } from "../../hooks/useBabylonRoomData";
import { useSocketContext } from "../../hooks/useWebSocket.tsx";

type HeaderType = {roomData: BabylonRoomData}
const Header = ({roomData}: HeaderType) => {
    const {userId, userName} = useStorage()
    const { send } = useSocketContext();
    const exit = () => { send({type: "exit", userId}); }
    return <div className="row blue lighten-2 white-text valign-wrapper m0">
        <div className="col s3"> <h5>Babylon</h5> </div>
        <div className="col s12">
            <div className={"right valign-wrapper" + (roomData.status==="waiting" ? "" : " hide")}>
                <div className="p0">
                    <span style={{marginRight: "10px"}}>{userName}</span>
                    <button id="joinRoom" className="btn waves-effect waves-light z-depth-0 blue darken-1"
                        style={{ margin: "3px 10px", padding: "0px 5px", width: "50px", height: "20px", lineHeight: "20px", fontSize: "50%" }}
                        onClick={exit}>
                        退室
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default Header