import React, { useEffect, useRef, useState } from "react";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { useStorage } from "../../../hooks/useStorage";

/**
 * チャット欄コンポーネント
 * @returns 
 */
export const ChatComponent = () => {
    /** WebSocketデータ */
    const {send, data, userLength, playerLength} = useBabylonWebSocket();

    const [hide, setHide] = useState(true)
    const [unread, setUnread] = useState(true)

    /** チャット入力値 */
    const [inputChat, setChatMessage] = useState("")
    /** チャットリスト */
    const roomchat = data.chat as {time: string, userName: string, content: string}[];
    /** チャット欄 Ref */
    const chatRef = useRef<HTMLUListElement>(null)
    /** チャット入力決定ハンドラ */
    const handleEnterChat = () => {
        const txt = inputChat.trim()
        if (0 < txt.length && txt.length < 51) { 
            send("addChat", {content: txt});
            setChatMessage("");
        }
    }
    /** チャット入力欄エンター押下ハンドラ */
    const handleEnterKeyChat = (e: any) => { if (e.key === "Enter") handleEnterChat() };
    /** チャット更新時の強制最下スクロール */
    useEffect(()=>{ if(chatRef.current)chatRef.current.scrollTop = chatRef.current?.scrollHeight; }, [roomchat])
    // 未読チェック
    useEffect(()=>{ if (hide) {setUnread(true)} }, [data.chat])

    return <>
        <div className="row s3 light-blue lighten-5 border1 chat-wrapper">
            <div className="chat-title m0" onClick={()=>{setHide(!hide); setUnread(false)}}>
                チャット
                <span className="unread">{hide && unread && data.chat.length > 0 ? data.chat[data.chat.length-1].content : ""}</span>
            </div>
            <div className={`slide ${hide?"closed":"open"}`}>
                {/* チャット */}
                <ul id="chat-lan" className="m0 chat-box" ref={chatRef}>
                    {roomchat.map(({time, userName, content}, index) =><React.Fragment key={index}>
                        <li className="chat-name-time" >
                            <span className="chat-name">{userName}</span>
                            <span className="chat-time">{time}</span>
                        </li>
                        <li className="chat-content">{content}</li>
                        </React.Fragment>
                    )}
                </ul>
                {/* 入力欄 */}
                <div className="valign-wrapper m0">
                    <div className="input-field col s12 p0">
                        <input id="chat" type="text" className="validate white m0"
                            style={{height: "20px", lineHeight: "20px", fontSize: "50%"}} placeholder=" enter your message " maxLength={50} 
                            value={inputChat}
                            onKeyDown={handleEnterKeyChat} 
                            onChange={(e) => setChatMessage(e.currentTarget.value)}
                            />
                        <div style={{position: "absolute", fontSize: "8px", color: "skyblue", right:"2px"}} aria-autocomplete="none">
                            (<span id="chat-len">{inputChat.length}</span>/50)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}