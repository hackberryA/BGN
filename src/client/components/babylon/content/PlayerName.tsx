import { CSSProperties } from "react";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";

type PlayNameProps = {
    style?: CSSProperties
}

/** ID指定 */
export const PlayerName = ({userId, style={}}: {userId: string} & PlayNameProps) => {
    const {data} = useBabylonWebSocket();
    if (userId in data.userInfoMap) {
        return <span className="player-name" style={{...style, color: data.userInfoMap[userId].color}}>
            {data.userInfoMap[userId].userName}
        </span>
    } else {
        return <></>
    }
}

/** 現在プレイヤー */
export const CurrentPlayerName = ({style={}}: PlayNameProps) => {
    const {data} = useBabylonWebSocket();
    const userId = data.playerIds[data.playerIndex];
    if (userId in data.userInfoMap) {
        return <span className="player-name" style={{...style, color: data.userInfoMap[userId].color}}>
            {data.userInfoMap[userId].userName}
        </span>
    } else {
        return <></>
    }
}
