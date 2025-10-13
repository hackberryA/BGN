import Header from "./components/Header";
import Message from "./components/Message";
import Footer from "./components/Footer";
import Content from "./components/Content";
import { SocketProvider } from "./hooks/useWebSocket";

export default function Babylon() {
    return (
        <SocketProvider url="ws://localhost:8081">
            <Header></Header>
            <Message></Message>
            <Content></Content>
            <Footer></Footer>
        </SocketProvider>
    )
}