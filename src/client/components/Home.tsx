import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStorage } from "../hooks/useStorage";
import { useSocketContext } from "../hooks/useWebSocket.tsx";
import { randomRoomId } from "../utils/StringUtils";
import { useBabylonRoomData } from "../hooks/useBabylonRoomData";

export default function Home() {
  const [roomId, setRoomId] = useState<string>();
  const {userName, setUserName} = useStorage();
  const [inputUserName, setInputUserName] = useState<string>(userName);
  const babylon = useBabylonRoomData();
  const [error, setError] = useState("");
  
  const { send } = useSocketContext();
  const navigate = useNavigate();
  const handleChangeUserName = (e: any) => {
    const value = e.currentTarget.value.trim();
    setInputUserName(value);
  }
  /****************************************
   * バビロン
   ****************************************/
  /** エンターキー */
  const handleEnterBabylon = (e: any) => { if (e.key === "Enter") enterBabylonRoom() }
  /** 部屋作成 */
  const createBabylonRoom = () => {
    // ユーザ名チェック
    if (userName === "") return;
    setUserName(userName);
    while(true) {
      // 部屋ID作成
      const newRoomId = randomRoomId()
      if (babylon.has(newRoomId)) continue;
      navigate(`/babylon/${roomId}`);
    }
  }
  /** 部屋参加 */
  const enterBabylonRoom = () => {
    if (!userName) return;
    if (!roomId) return;
    if (!babylon.has(roomId)) {
      setError("部屋IDが存在しません。")
      return;
    }
    setUserName(userName);
    navigate(`/babylon/${roomId}`);
  }
  return <>
    <div className="row blue lighten-2 white-text valign-wrapper m0">
        <div className="col s3">
            <h5>なのは's workspace</h5>
        </div>
        <div className="col s12">
            <div className={"right valign-wrapper"}>
              <div className="input-field col s9 p0" style={{display: "contents"}}>
                <span style={{marginRight: "10px"}}>Babylon: </span>
                <span style={{marginRight: "10px"}}>
                  <input id="userName" type="text" className="validate white m0" maxLength={10}
                    style={{height: "20px", lineHeight: "20px", marginRight: "10px"}} placeholder=" your name "
                    value={inputUserName} onChange={handleChangeUserName}
                    onKeyDown={handleEnterBabylon} />
                </span>
                  <button id="joinRoom" className="btn waves-effect waves-light z-depth-0 blue darken-1"
                      style={{ margin: "3px 10px", padding: "0px 5px", width: "50px", height: "20px", lineHeight: "20px", fontSize: "50%" }}
                      onClick={createBabylonRoom}>
                      作成
                  </button>
              </div>
              <div className="p0">
                  <span style={{marginRight: "10px"}}>
                    <input id="roomId" type="text" className="validate white m0" maxLength={10}
                      style={{height: "20px", lineHeight: "20px", marginRight: "10px"}} placeholder=" room id "
                      value={roomId} onChange={(e)=>setRoomId(e.currentTarget.value.trim())}
                      onKeyDown={handleEnterBabylon}
                    />
                  </span>
                  <button id="joinRoom" className="btn waves-effect waves-light z-depth-0 blue darken-1"
                      style={{ margin: "3px 10px", padding: "0px 5px", width: "50px", height: "20px", lineHeight: "20px", fontSize: "50%" }}
                      onClick={enterBabylonRoom}>
                      参加
                  </button>
                  <span id="error" className="red"></span>
              </div>
            </div>
        </div>
    </div>
  </>;
}