import { useBabylonWebSocket } from "../../hooks/useBabylonWebSocket";
import { ChatComponent } from "./content/ChatView";
import { GameInfoView } from "./content/GameInfoView";
import { PlayerBoardCanvas } from "./content/PlayerBoardCanvas";
import { QuarryCanvas } from "./content/QuarryCanvas";

const Content = () => {
    const {send, roomInfo, gameInfo, userInfoMap, playerInfoMap, userLength, playerLength} = useBabylonWebSocket();
    // const clientInfo = userInfoMap[localStorage.getItem(USERID_KEY)!]
     return (
        <div className="row" style={{padding: "0px 20px"}}>
            <QuarryCanvas />
            <PlayerBoardCanvas />
            <div className="col s2">
                <div className="row">
                    <GameInfoView />
                    {/* Chat */}
                    <ChatComponent />
                </div>
            </div>
        </div>
    )
}
export default Content;