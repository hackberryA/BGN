import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketProvider } from "../../hooks/useBabylonWebSocket";
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";
import Message from "./Message";
import { USERNAME_KEY } from "../../const/const";

export default function Babylon() {
    const {roomId} = useParams();
    const navigate = useNavigate()
    useEffect(()=>{
        if (!roomId) navigate("/");
        if (!localStorage.getItem(USERNAME_KEY)) navigate("/");
    }, [])
    return localStorage.getItem(USERNAME_KEY) && (
        <SocketProvider roomId={roomId!}>
            <Header />
            <Message />
            <Content />
            <Footer />
        </SocketProvider>
    );
}