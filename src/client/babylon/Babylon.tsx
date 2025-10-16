import Header from "./components/Header";
import Message from "./components/Message";
import Footer from "./components/Footer";
import Content from "./components/Content";
import { SocketProvider } from "../hooks/useWebSocket.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { BabylonRoomData, useBabylonRoomData } from "../hooks/useBabylonRoomData";
import { useEffect, useState } from "react";

export default function Babylon() {
    const {roomId} = useParams();
    const roomDataStore = useBabylonRoomData();
    const navigate = useNavigate()
    const [roomData] = useState<BabylonRoomData | undefined>(roomDataStore.get(roomId))

    useEffect(()=>{
        if (!roomId || !roomData) navigate("/");
    }, [])
    
    return <> {
        roomData &&
            <SocketProvider roomId={roomId}>
                <Header roomData={roomData} />
                <Message roomData={roomData} />
                <Content roomData={roomData} />
                <Footer />
            </SocketProvider>
        } </>
}