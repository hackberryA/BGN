import React, { useEffect, useRef, useState } from "react";
import { USERID_KEY } from "../../../const/const";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";

export const ChatView = () => {
    const {send, roomInfo, gameInfo, userInfoMap, playerInfoMap, userLength, playerLength} = useBabylonWebSocket();
    const clientInfo = userInfoMap[localStorage.getItem(USERID_KEY)!]
    /** チャット */
    const [chatMessage, setChatMessage] = useState("")
    const chatRef = useRef<HTMLUListElement>(null)
    const enterChat = () => {
        if (!chatMessage.trim()) return;
        send("addChat", {content: chatMessage.trim()})
        setChatMessage("")
    }
    useEffect(()=>{
        if(chatRef.current)chatRef.current.scrollTop = chatRef.current?.scrollHeight;
    }, [roomInfo.chat])
    return <>
        <div className="row s3 light-blue lighten-5 border1">
            <div id="log" className="m0" style={{fontSize: "10px", lineHeight: 1.5, paddingLeft: "5px", backgroundColor: "#aedaec", border: "none"}}>チャット</div>
            {/* チャット */}
            <ul id="chat-lan" className="m0 chat-box" ref={chatRef}>
                {roomInfo.chat.map(({time, userName, content}, index) =><React.Fragment key={index}>
                    <li className="chat-title" >
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
                        value={chatMessage}
                        onKeyDown={(e)=>{ if (e.key === "Enter") enterChat() }} 
                        onChange={(e) => setChatMessage(e.currentTarget.value)}
                        />
                    <div style={{position: "absolute", fontSize: "8px", color: "skyblue", right:"2px"}} aria-autocomplete="none">
                        (<span id="chat-len">{chatMessage.length}</span>/50)
                    </div>
                </div>
            </div>
        </div>
    </>
}