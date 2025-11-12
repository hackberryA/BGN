import { ChatComponent } from "./content/ChatView";
import { ControlDescription } from "./content/ControlDescription";
import { DebugInfo } from "./content/DebugInfo";
import { GameInfoView } from "./content/GameInfoView";
import { PlayerBoard, PlayerBoardProps } from "./content/PlayerBoard";
import { QuarryCanvas, QuarryCanvasProps } from "./content/QuarryCanvas";
import { ScoreInfo } from "./content/ScoreInfo";

type ContentProps = {
    quarryProps: QuarryCanvasProps;
    playerBoardProps: PlayerBoardProps;
}
const Content = ({quarryProps, playerBoardProps}: ContentProps) => {
    // const {send} = useBabylonWebSocket();
    // const clientInfo = userInfoMap[localStorage.getItem(USERID_KEY)!]
     return ( <>
        <div className="row" style={{padding: "0px 20px", marginBottom: "30px"}}>
            <QuarryCanvas {...quarryProps} />
            <PlayerBoard {...playerBoardProps} />
            <div className="col s2">
                <div className="row">
                    <GameInfoView />
                    <ChatComponent />
                </div>
            </div>
        </div>
        <ControlDescription />
        <ScoreInfo />
        <DebugInfo />
    </> )
}
export default Content;