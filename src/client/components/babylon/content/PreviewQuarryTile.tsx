import { useEffect, useState } from "react";
import { TerraceTileInfo } from "../../../types/BabylonTypes"
import { QuarryTile } from "./QuarryTile"
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";

type PreviewQuarryTileProps = {
    selected: number;
    quarry: TerraceTileInfo[][];
    isFlower?: boolean;
}
export const PreviewQuarryTile = (props: PreviewQuarryTileProps) => {
    const {send, data, userLength, playerLength} = useBabylonWebSocket();
    const {selected, quarry, isFlower=false} = props
    const [hide, setHide] = useState(false)
    useEffect(()=>{ setHide(false) }, [selected])
    useEffect(()=>{ setHide(true) }, [data.playerIndex, data.phase])
    if (selected < 0) return <></>
    const q = (quarry[selected][0].display) ? quarry[selected][0]
                : (quarry[selected][1].display) ? quarry[selected][1]
                : (quarry[selected][2].display) ? quarry[selected][2] : undefined
    return q ? <div className={`quarry-preview ${hide && "hide"}`} onClick={()=>setHide(true)}>
        {/* <span className="selected-quarry-text">選択中</span> */}
        <QuarryTile layer={q.layer} flower={q.flower} symbols={q.symbols} isFlower={isFlower}/>
    </div> : <></>
}