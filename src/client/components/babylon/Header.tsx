import { useEffect, useRef, useState } from "react";
import { ICON_LIST, NAME_COLOR_LIST } from "../../const/const";
import { useBabylonWebSocket } from "../../hooks/useBabylonWebSocket";
import { useStorage } from "../../hooks/useStorage";

const Header = () => {
    const {send, userInfo} = useBabylonWebSocket();
    const storage = useStorage()
    const [openUserInfo, setOpenUserInfo] = useState<boolean>(false)
    const [openColorPicker, setOpenColorPicker] = useState<boolean>(false)
    const [openIconPicker, setOpenIconPicker] = useState<boolean>(false)
    const userInfoRef = useRef<HTMLDivElement>(null);
    const iconInfoRef = useRef<HTMLDivElement>(null);
    const colorInfoRef = useRef<HTMLDivElement>(null);

    /** アイコン選択表示 */
    // const clickSelectIconHandler = (e: any)=>{
    //     e.stopPropagation();
    //     setOpenIconPicker(true);
    // }
    
    /** アイコン選択 */
    const selectIconHandler = (icon: string) => (e: any) => {
        e.stopPropagation();
        send("selectUserIcon", {icon})
        setOpenIconPicker(false)
        storage.setUserIcon(icon)
    }
    
    /** 色選択 */
    const selectColorHandler = (color: string) => (e: any) => {
        e.stopPropagation();
        send("selectUserColor", {color})
        setOpenColorPicker(false)
        storage.setUserColor(color)
    }
            
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            const userInfoEl = userInfoRef.current;
            const iconInfoEl = iconInfoRef.current;
            const colorInfoEl = colorInfoRef.current;

            // Info の中をクリック → 何もしない
            if (colorInfoEl && colorInfoEl.contains(target)) return;
            if (iconInfoEl && iconInfoEl.contains(target)) return;

            // colorInfo の外をクリックしたら colorPicker を閉じる
            // if (openIconPicker) setOpenIconPicker(false);
            // if (openColorPicker) setOpenColorPicker(false);

            // userInfo の外をクリックしたら 両方閉じる
            if (userInfoEl && !userInfoEl.contains(target)) {
                setOpenUserInfo(false);
                setOpenIconPicker(false);
                setOpenColorPicker(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openColorPicker, openIconPicker]);

    return <div className="row blue lighten-2 white-text valign-wrapper m0">
        <div style={{paddingLeft: "10px"}}><a href="/" style={{color: "white"}}> <h5>Babylon</h5> </a></div>
        <div className="col s12">
            <div className="right valign-wrapper">
                <div className="p0">
                    <span style={{marginRight: "10px"}}>{storage.userName}{userInfo.auth ? " (Auth)" : ""}</span>
                    {/* <button id="joinRoom" className="btn waves-effect waves-light z-depth-0 blue darken-1"
                        style={{ margin: "3px 10px", padding: "0px 5px", width: "50px", height: "20px", lineHeight: "20px", fontSize: "50%" }}
                        onClick={exit}>
                        退室
                    </button> */}
                </div>
                <div ref={userInfoRef}>
                    <div className="user-icon" onClick={() => setOpenUserInfo(!openUserInfo)}>
                        <img src={`/images/icons/${storage.userIcon}.png`} />
                    </div>
                    {openUserInfo &&<div className="user-info" >
                        <div className="user-icon" onClick={() => setOpenIconPicker(!openIconPicker)}><img src={`/images/icons/${storage.userIcon}.png`} />
                        </div>

                        {openIconPicker && <div className="icon-info" ref={iconInfoRef}>
                            {ICON_LIST.map((icon)=>
                                <div className="user-icon" onClick={selectIconHandler(icon)} style={{marginBottom: "10px"}}>
                                    <img src={`/images/icons/${icon}.png`}/>
                                </div>
                            )}
                        </div>}
                        
                        <div className="user-name">{storage.userName}<br/><span className="user-id">{storage.userId}</span></div>
                        <hr/>
                        <div className="user-color">
                            色選択：<span className="color-box" style={{backgroundColor: userInfo.color}} onClick={() => setOpenColorPicker(!openColorPicker)}/>
                            {openColorPicker && <div className="color-info" ref={colorInfoRef}>
                                {NAME_COLOR_LIST.map((color)=>
                                    <div key={color} onClick={selectColorHandler(color)} style={{cursor: "pointer"}}>
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