import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketProvider } from "../../hooks/useBabylonWebSocket";
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";
import Message from "./Message";
import { useStorage } from "../../hooks/useStorage";
import '../../style/babylon/default.css'
import '../../style/babylon/chat.css'

export default function Babylon() {
    const {roomId} = useParams();
    const storage = useStorage()
    const navigate = useNavigate()
    useEffect(()=>{
        if (!roomId) navigate("/");
        if (storage.userName === "") navigate("/");
    }, [])
    return (storage.userName !== "") && (
        <SocketProvider roomId={roomId!}>
            <Header />
            <Message />
            <Content />
            <Footer />
        </SocketProvider>
    );
}