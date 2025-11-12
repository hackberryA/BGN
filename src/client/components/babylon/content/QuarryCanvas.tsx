import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { useStorage } from "../../../hooks/useStorage";
import { PreviewQuarryTile } from "./PreviewQuarryTile";
import { QuarryTile } from "./QuarryTile";

export type QuarryCanvasProps = {
    selected: number;
    setSelected: Dispatch<SetStateAction<number>>;
}

export const QuarryCanvas = (props: QuarryCanvasProps) => {
    const [mouseOver, setMouseOver] = useState(-1)
    const {send, data, userLength, playerLength} = useBabylonWebSocket();
    const {selected, setSelected} = props
    const storage = useStorage()
    const userInfo = data.userInfoMap[storage.userId]
    // 採掘フェーズ、現在プレイヤーのみ選択可
    const isPlayingNow = (data.phase === "setup" || data.phase === "quarry")
                        && (storage.userId === data.playerIds[data.playerIndex])

    return <>
            <div className="col s3">
            <div className="col s12 border2 valign-wrapper center quarry"
                style={{aspectRatio: "1/1", position: "relative", backgroundColor: data.quarry.length == 0 ? "white" : "black"}}>
                {/* <span style={{position: "absolute", left:"3px", top:"0px"}}>Quarry</span> */}
                {data.quarry.length > 0 &&
                    data.quarry.map((tiles, idx)=> {
                        if (tiles[0].display) {
                            return <QuarryTile 
                                key={`quarry-tile-${idx}`}
                                selected={idx === selected}
                                onClick={isPlayingNow ? ()=>setSelected(selected == idx ? -1 : idx) : ()=>{}}
                                onMouseOver={selected >= 0 ? ()=>{} : ()=>setMouseOver(idx)}
                                onMouseOut={selected >= 0 ? ()=>{} : ()=>setMouseOver(-1)}
                                layer={tiles[0].layer}
                                flower={tiles[0].flower}
                                symbols={tiles[0].symbols}
                            />
                        }
                        return <div className="quarry-tile" key={`quarry-tile-${idx}-empty`}></div>
                    })
                }
                <PreviewQuarryTile 
                    selected={selected >= 0 ? selected : mouseOver}
                    quarry={data.quarry}
                />
            </div>
            <div className="col s12 border1 p0" style={{marginTop: "10px"}}>
                <div id="room-log-title" className="m0" style={{fontSize: "10px", lineHeight: 1.5, paddingLeft: "5px", backgroundColor: "#aedaec"}}>全体ログ</div>
                <ul id="room-log" className="m0" style={{height: "140px", overflowY: "scroll", fontSize: "10px", lineHeight: 1.5}}>
                    {data.logs.map(({time, content}, index) => 
                        <li style={{padding: "0 5px", lineHeight: 1.6}} key={`common-log-${index}`}>
                            [{time}] {content}
                        </li>
                    )}
                </ul>
            </div>
            {/* <div className="col s12 border1 p0" style={{marginTop: "10px"}}>
                <div id="client-log-title" className="m0" style={{fontSize: "10px", lineHeight: 1.5, paddingLeft: "5px", backgroundColor: "#aedaec"}}>個人ログ</div>
                <ul id="client-log" className="m0" style={{height: "80px", overflowY: "scroll", fontSize: "10px", lineHeight: 1.5}}>
                    {userInfo && userInfo.logs.map(({time, content}, index) => 
                        <li style={{padding: "0 5px", lineHeight: 1.6}} key={index}>
                            [{time}] {content}
                        </li>
                    )}
                </ul>
            </div> */}
            <div style={{fontSize: "8px", color: "skyblue", right:"2px"}} aria-autocomplete="none">
                閲覧 ({userLength}人)<br/>
                参加 ({playerLength}人) {data.playerIds.map(id=>data.userInfoMap[id].userName).join(", ")}
            </div>
        </div>
    </>
}
