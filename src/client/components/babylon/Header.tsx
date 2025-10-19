import { useEffect, useRef, useState } from "react";
import { useBabylonWebSocket } from "../../hooks/useBabylonWebSocket";
import { useStorage } from "../../hooks/useStorage";
import { NAME_COLOR_LIST, USERCOLOR_KEY } from "../../const/const";

const Header = () => {
    const {send, roomInfo, userInfoMap, playerInfoMap} = useBabylonWebSocket();
    const {userId, userName} = useStorage()
    const [openUserInfo, setOpenUserInfo] = useState<boolean>(false)
    const [openColorPicker, setOpenColorPicker] = useState<boolean>(false)
    const userInfoRef = useRef<HTMLDivElement>(null);
    const colorInfoRef = useRef<HTMLDivElement>(null);
    const selectColorHandler = (color: string) => {
        send("selectUserColor", {color})
        setOpenColorPicker(false)
        localStorage.setItem(USERCOLOR_KEY, color)
    }
            
    useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;

        const userInfoEl = userInfoRef.current;
        const colorInfoEl = colorInfoRef.current;

        // colorInfo の中をクリック → 何もしない
        if (colorInfoEl && colorInfoEl.contains(target)) return;

        // colorInfo の外をクリックしたら colorPicker を閉じる
        if (openColorPicker) {
        setOpenColorPicker(false);
        }

        // userInfo の外をクリックしたら 両方閉じる
        if (userInfoEl && !userInfoEl.contains(target)) {
        setOpenUserInfo(false);
        setOpenColorPicker(false);
        }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
    }, [openColorPicker]);

    return <div className="row blue lighten-2 white-text valign-wrapper m0">
        <div style={{paddingLeft: "10px"}}><a href="/" style={{color: "white"}}> <h5>Babylon</h5> </a></div>
        <div className="col s12">
            <div className="right valign-wrapper">
                <div className="p0">
                    <span style={{marginRight: "10px"}}>{userName}{userInfoMap[userId] && userInfoMap[userId].auth ? " (Auth)" : ""}</span>
                    {/* <button id="joinRoom" className="btn waves-effect waves-light z-depth-0 blue darken-1"
                        style={{ margin: "3px 10px", padding: "0px 5px", width: "50px", height: "20px", lineHeight: "20px", fontSize: "50%" }}
                        onClick={exit}>
                        退室
                    </button> */}
                </div>
                <div ref={userInfoRef}>
                    <div className="user-icon" onClick={() => setOpenUserInfo(!openUserInfo)}>
                        <img src="/images/icons/nanoha.png"/>
                    </div>
                    {openUserInfo &&<div className="user-info" >
                        <div className="user-icon"><img src="/images/icons/nanoha.png"/></div>
                        <div className="user-name">{userName}<br/><span className="user-id">{userId}</span></div>
                        <hr/>
                        <div className="user-color">
                            色選択：<span className="color-box" style={{backgroundColor: userInfoMap[userId].color}} onClick={(e)=>{
                                
  e.stopPropagation();
                                setOpenColorPicker(true)}}/>
                            {openColorPicker && <div className="color-info" ref={colorInfoRef}>
                                {NAME_COLOR_LIST.map((color)=>
                                    <div key={color} onClick={(e)=>{ e.stopPropagation();selectColorHandler(color)}} style={{cursor: "pointer"}}>
                                        <span className="color-box" style={{backgroundColor: color}} />
                                        <span style={{color: color}}> 名前なまえname</span>
                                    </div>
                                )}
                            </div>}
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    </div>
}

export default Header