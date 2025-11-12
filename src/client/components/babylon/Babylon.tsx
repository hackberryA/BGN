import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketProvider } from "../../hooks/useBabylonWebSocket";
import Content from "./Content";
import Footer from "./footer/Footer";
import Header from "./Header";
import Message from "./Message";
import { useStorage } from "../../hooks/useStorage";
import '../../style/babylon/default.css'
import '../../style/babylon/chat.css'
import '../../style/babylon/tabs.css'
import '../../style/babylon/loading.css'
import '../../style/babylon/quarry.css'
import '../../style/babylon/user-info.css'
import '../../style/babylon/player-board.css'
import '../../style/babylon/debug.css'
import { Loading } from "./Loading";

export default function Babylon() {
    const {roomId} = useParams();
    const storage = useStorage()
    const navigate = useNavigate()
    useEffect(()=>{
        if (!roomId) navigate("/");
        if (storage.userName === "") navigate("/");
    }, [])

    // 採掘場選択
    const [selectedQuarry, setSelectedQuarry] = useState<number>(-1)
    // 配置タイル選択
    const [selectedTile, setSelectedTile] = useState<number>(-1)
    return (storage.userName !== "") && (
        <SocketProvider roomId={roomId!}>
            <Loading />
            <Header />
            <Message 
                quarryProps={{selected: selectedQuarry, setSelected: setSelectedQuarry}} 
                playerBoardProps={{selected: selectedTile, setSelected: setSelectedTile}}
            />
            <Content
                quarryProps={{selected: selectedQuarry, setSelected: setSelectedQuarry}} 
                playerBoardProps={{selected: selectedTile, setSelected: setSelectedTile}}
            />
            <Footer />
        </SocketProvider>
    );
}