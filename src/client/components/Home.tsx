import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateUUID, randomRoomId } from "../utils/StringUtils";
import { VRMModelCanvas } from "./babylon/meshes/VRMModel";
import { AUTH_KEY, PREUSERNAME_KEY, USERID_KEY, USERNAME_KEY } from "../const/const";

export default function Home() {
  const [roomId, setRoomId] = useState<string>("");
  const [gameId, setGameId] = useState<string>("babylon");
  const [password, setPassword] = useState<string>("");
  const [inputUserName, setInputUserName] = useState<string>(localStorage.getItem(USERNAME_KEY) || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChangeUserName = (e: any) => {
    const value = e.currentTarget.value.trim();
    setInputUserName(value);
  }
  
  useEffect(() => {
      const elm = document.querySelectorAll('select')
      M.FormSelect.init(elm , {}); // Materialize 初期化
  }, []); //初回レンダリング

  
  /** 部屋参加 */
  const enterRoom = () => {
    if (!inputUserName) {
      setError("名前を入力してください。")
      return;
    }
    if (gameId !== "babylon"){
      setError("Babylonを選択してください。")
      return;
    }
    if (!roomId) {
      setError("部屋IDを入力してください")
      return;
    }
    if (!localStorage.getItem(USERID_KEY)) {
      localStorage.setItem(USERID_KEY, generateUUID())
    }
    localStorage.setItem(PREUSERNAME_KEY, localStorage.getItem(USERNAME_KEY) || "")
    localStorage.setItem(USERNAME_KEY, inputUserName)
    localStorage.setItem(AUTH_KEY, "false")
    navigate(`/${gameId}/${roomId}`);
  }

  /** 部屋作成 */
  const createRoom = () => {
    // ユーザ名チェック
    // if (password !== "P@ssw0rd!") {
    //   setError("You!")
    //   return;
    // }
    // ユーザ情報設定
    localStorage.setItem(USERID_KEY, generateUUID())
    localStorage.setItem(USERNAME_KEY, "なのは")
    localStorage.setItem(AUTH_KEY, "true")
    // 部屋ID作成
    const newRoomId = randomRoomId()
    navigate(`/${gameId}/${newRoomId}`);
  }


  return <>
    <div className="row blue lighten-2 white-text valign-wrapper m0">
      <div className="col s3">
          <h5>なのは's workspace</h5>
      </div>
      <div className="col s12">
        <div className="right valign-wrapper" style={{marginRight: "5px"}}>
          <div className="input-field" style={{display: "contents"}}>
            <span style={{marginRight: "10px"}}>
              <input id="userName" type="text" className="validate white m0" maxLength={20}
                style={{height: "21px", lineHeight: "21px", marginRight: "10px"}} placeholder=" your name "
                value={inputUserName} onChange={handleChangeUserName}
                onKeyDown={(e)=>{ if (e.key === "Enter") enterRoom() }} />
            </span>
            <span style={{marginRight: "10px"}}>
              <select onChange={(e)=>setGameId(e.currentTarget.value)}>
                <option value="babylon">Babylon</option>
                <option value="test">test</option>
              </select>
            </span>
            <span>
              <input id="roomId" type="text" className="validate white m0" maxLength={50}
                style={{height: "21px", lineHeight: "21px"}} placeholder=" room id "
                value={roomId} onChange={(e)=>setRoomId(e.currentTarget.value.trim())}
                onKeyDown={(e)=>{ if (e.key === "Enter") enterRoom() }} />
            </span>
            <span style={{marginRight: "10px"}}>
              <button id="joinRoom" className="btn waves-effect waves-light z-depth-0 blue darken-1"
                style={{ marginRight: "10px", marginBottom: "1px", padding: "0px 5px", width: "50px", height: "21px", lineHeight: "21px", fontSize: "50%" }}
                onClick={enterRoom}>
                参加
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col s12">
        <div className="right valign-wrapper" style={{marginRight: "5px", color: "red", height: "20px"}}>
          <span>{error}</span>
        </div>
      </div>
    </div>
    {/* <div className="row valign-wrapper m0">
       <VRMModelCanvas/>
    </div> */}
    <footer className="row valign-wrapper m0">
      <div className="col s12">
        <div className="right valign-wrapper" style={{marginRight: "5px"}}>
          <div className="input-field" style={{display: "contents"}}>
            <span style={{marginRight: "10px"}}>
              管理用：
            </span>
            <span style={{marginRight: "10px"}}>
              <select onChange={(e)=>setGameId(e.currentTarget.value)}>
                <option value="babylon">Babylon</option>
              </select>
            </span>
            <span>
              <input id="password" type="password" className="validate white m0" maxLength={10}
                style={{height: "21px", lineHeight: "21px"}} placeholder=""
                value={password} onChange={(e)=>setPassword(e.currentTarget.value.trim())}
                onKeyDown={(e)=>{ if (e.key === "Enter") createRoom() }} />
            </span>
            <span style={{marginRight: "10px"}}>
              <button className="btn waves-effect waves-light z-depth-0 blue darken-1"
                style={{ marginRight: "10px", marginBottom: "1px", padding: "0px 5px", width: "50px", height: "21px", lineHeight: "21px", fontSize: "50%" }}
                onClick={createRoom}>
                作成
              </button>
            </span>
          </div>
        </div>
      </div>
    </footer>
  </>;
}