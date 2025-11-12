import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { useStorage } from "../../../hooks/useStorage";
import { BabylonCanvas } from "./canvas/BabylonCanvas";
import { PlayerName } from "./PlayerName";
import { QuarryTile } from "./QuarryTile";

export type PlayerBoardProps = {
    selected: number;
    setSelected: Dispatch<SetStateAction<number>>;
}
export const PlayerBoard = (props: PlayerBoardProps) => {
    const {selected, setSelected} = props;
    const {data} = useBabylonWebSocket();
    const storage = useStorage()
    const [hide, setHide] = useState(false)
    const [zoom, setZoom] = useState(2)
    const setZoomMinus = () => { if (zoom > 0) setZoom(zoom-1) }
    const setZoomPlus = () => { if (zoom < 2) setZoom(zoom+1) }
    
    useEffect(()=>setHide(false), [selected])

    const tooltipRef = useRef<HTMLAnchorElement>(null);
    useEffect(() => {
        if (tooltipRef.current) {
        // 初期化
        const instance = M.Tooltip.init(tooltipRef.current, {
            position: "right",
            exitDelay: 50,
            enterDelay: 50,
        });

        // クリーンアップ
        return () => {
            instance.destroy();
        };
        }
    }, [tooltipRef]);
    const playerIds = []
    if  (data.playerIds.includes(storage.userId)) {
        // プレイヤ―の場合
        playerIds.push(storage.userId);
        data.playerIds.forEach(v=>{ if (v!==storage.userId) {playerIds.push(v);} });
    } else {
        // 観戦者の場合
        data.playerIds.forEach(v=>{ playerIds.push(v) });
    }

    
    const playerInfo = data.playerInfoMap[storage.userId]
    const selectedMap = Object.values(playerInfo?.selectedTileMap || {}).map(v=>v.tileNo)
    
    // 建築フェーズ、現在プレイヤーのみ選択可
    const isPlayingNow = (data.phase === "building") && (storage.userId === data.playerIds[data.playerIndex])
    const isSettingTile = isPlayingNow && (playerInfo.selectTarget === "tile" || playerInfo.selectTarget === "discarding")
    return <>
        <div className="col s7">
            <div id="wrapper-canvas" className={`col s${12-zoom} border3 valign-wrapper center p0`} style={{aspectRatio: "4/3", position: "relative"}}>
                {data.roomStatus === "waiting" && <span style={{position: "absolute", left:"3px", top:"0px", zIndex:10}}>プレビュー</span>}
                {playerInfo && <>
                    <span style={{position: "absolute", left:"3px", top:"0px", zIndex:10}}><PlayerName userId={storage.userId} /></span>
                    <span style={{position: "absolute", right:"3px", top:"0px", zIndex:10}}>　{playerInfo && "♜".repeat(playerInfo.pillar)}</span>
                    {/* ストックなし */}
                    {playerInfo.storageTiles.length == 0 && <>
                        <img src="/images/babylon/description/500.png" className="border1 stock-tile-main" />
                    </>}
                    {/* ストック1枚 */}
                    {playerInfo.storageTiles.length >= 1 && <>
                        <div className="storage-tile">
                            <QuarryTile 
                                selected={selected === 0}
                                onClick={isSettingTile ? ()=>setSelected(selected == 0 ? -1 : 0) : ()=>{}}
                                layer={playerInfo.storageTiles[0].flower}
                                flower={playerInfo.storageTiles[0].flower}
                                symbols={playerInfo.storageTiles[0].symbols}
                                isFlower={true}
                                disabled={selectedMap.includes(playerInfo.storageTiles[0].tileNo)}
                            />
                        </div>
                    </>}
                    {/* ストック2枚 */}
                    {playerInfo.storageTiles.length >= 2 && <>  
                        <div className="storage-tile" style={{top: "18%"}}>
                            <QuarryTile 
                                selected={selected === 1}
                                onClick={isSettingTile ? ()=>setSelected(selected == 1 ? -1 : 1) : ()=>{}}
                                layer={playerInfo.storageTiles[1].flower}
                                flower={playerInfo.storageTiles[1].flower}
                                symbols={playerInfo.storageTiles[1].symbols}
                                isFlower={true}
                                disabled={selectedMap.includes(playerInfo.storageTiles[1].tileNo)}
                            />
                        </div>
                    </>}
                    {/* プレビュー */}
                    {playerInfo.storageTiles[selected] && !hide &&
                        <div className="storage-tile-preview storage-tile" onClick={()=>setHide(true)}>
                            <div className="quarry-preview">
                                <QuarryTile 
                                    layer={playerInfo.storageTiles[selected].flower}
                                    flower={playerInfo.storageTiles[selected].flower}
                                    symbols={playerInfo.storageTiles[selected].symbols}
                                    isFlower={true}
                                />
                            </div>
                        </div>
                    }
                </>}
                {data.roomStatus === "waiting" && <BabylonCanvas playerId={"preview"} props={props} />}
                {data.roomStatus !== "waiting" && <BabylonCanvas playerId={playerIds[0]} props={props} />}
                {/* <div className={`control-description ${hideHint?" hide-hint":""}`} onClick={()=>setHideHint(!hideHint)} >
                    <a className="tooltipped" data-position="right" data-tooltip={"操作説明"} ref={tooltipRef}>
                        {hideHint && "？"}
                        {!hideHint && <>
                            <div style={{borderRight: "skyblue dotted 1px", float: "left", paddingRight: "15px"}}>
                                【左クリック】オブジェクト操作<br/>
                                【右クリック】カメラ回転<br/>
                                【中クリック】カメラ移動<br/>
                                【ホイール】拡大・縮小
                            </div>
                            <div>
                                【柱】左クリックで配置 ➡ 段数変更 ➡ 解除<br/>
                                【タイル】左クリックで配置 ➡ 回転<br/>
                                （設置解除はボタン）<br/>
                            </div>
                        </>} 
                    </a>
                </div> */}
                <div className="zoom-button">
                    <i className={`material-icons ${zoom==2 ? "disabled" : "active"}`} onClick={setZoomPlus}>first_page</i>
                    <i className={`material-icons ${zoom==0 ? "disabled" : "active"}`} onClick={setZoomMinus}>last_page</i>
                </div>
            </div>
            {zoom > 0 &&
                <div className={`col s${zoom}`} style={{position: "relative"}}>
                    <OtherPlayerBoardCanvas key={playerIds[1]} playerId={playerIds[1]} />
                    <OtherPlayerBoardCanvas key={playerIds[2]} playerId={playerIds[2]} />
                    <OtherPlayerBoardCanvas key={playerIds[3]} playerId={playerIds[3]} />
                </div>
            }
        </div>
    </>
}

type OtherPlayerBoardCanvasProps = {playerId?: string}
const OtherPlayerBoardCanvas = ({playerId}: OtherPlayerBoardCanvasProps) => {
    const {data} = useBabylonWebSocket();
    const [hover, setHover] = useState(-1)
    const [expand, setExpand] = useState(false)
    const [visible, setVisible] = useState(true)

    const handleExpand = () => {
        setExpand(!expand)
        if (!expand) {
            setVisible(false)
            requestAnimationFrame(() => {
                setVisible(true)
            })
        } else {
            setVisible(true)
        }

    };

    const playerInfo = data.playerInfoMap[playerId!]
    if (!playerId || !playerInfo) {
        return <div className="col s12 p0 border1" style={{aspectRatio: "1/1", position: "relative", marginBottom: "10px"}}>
            <img src="/images/babylon/description/500.png" className="responsive-img" />
        </div>
    }
    return <>
        {expand && <div className="expand-canvas-mordal" onClick={handleExpand} />}
        <div className={`col s12 p0 border1 other-player-board ${expand ? "expand-canvas" : "normal-canvas"}`}
            style={visible ? {opacity:1, transition: "opacity .5s ease" } : {opacity:0}} >
            <span style={{position: "absolute", left:"3px", top:"0px", zIndex: 10}}><PlayerName userId={playerId} /></span>
            {!expand && <>
                <span style={{position: "absolute", right:"3px", top: "0px", zIndex: 10}}>{playerInfo ? (playerInfo.pillar > 9 ? `♜(${playerInfo.pillar})` : "♜".repeat(playerInfo.pillar)) : "　"}</span>

                {/* ストックなし */}
                {playerInfo.storageTiles.length == 0 && <>
                    <img src="/images/babylon/description/500.png" className="border1 stock-tile-sub" />
                </>}
                {/* ストック1枚 */}
                {playerInfo.storageTiles.length == 1 && <>
                    <div className="storage-tile">
                        <QuarryTile 
                            key="storage-tile-0"
                            layer={playerInfo.storageTiles[0].flower}
                            flower={playerInfo.storageTiles[0].flower}
                            symbols={playerInfo.storageTiles[0].symbols}
                            isFlower={true}
                            onMouseOver={()=>setHover(0)}
                            onMouseOut={()=>setHover(-1)}
                        />
                    </div>
                </>}
                {/* ストック2枚 */}
                {playerInfo.storageTiles.length >= 2 && <>  
                    <div className="storage-tile">
                        <QuarryTile 
                            key="storage-tile-1"
                            layer={playerInfo.storageTiles[0].flower}
                            flower={playerInfo.storageTiles[0].flower}
                            symbols={playerInfo.storageTiles[0].symbols}
                            isFlower={true}
                            onMouseOver={()=>setHover(0)}
                            onMouseOut={()=>setHover(-1)}
                        />
                    </div>
                    <div className="storage-tile" style={{top: "25%"}}>
                        <QuarryTile 
                            key="storage-tile-2"
                            layer={playerInfo.storageTiles[1].flower}
                            flower={playerInfo.storageTiles[1].flower}
                            symbols={playerInfo.storageTiles[1].symbols}
                            isFlower={true}
                            onMouseOver={()=>setHover(1)}
                            onMouseOut={()=>setHover(-1)}
                        />
                    </div>
                </>}
                {/* プレビュー */}
                {hover >= 0 && playerInfo.storageTiles[hover] &&
                    <div className="storage-tile-preview storage-tile">
                        <QuarryTile 
                            key="preview-quarry-tile"
                            layer={playerInfo.storageTiles[hover].flower}
                            flower={playerInfo.storageTiles[hover].flower}
                            symbols={playerInfo.storageTiles[hover].symbols}
                            isFlower={true}
                            style={{width: "300%", right: "210%"}}
                        />
                    </div>
                }
            </>}
            {data.roomStatus !== "waiting" && <BabylonCanvas key={playerId} playerId={playerId} />}

            <div className={"expand-button"} onClick={handleExpand} >
                {!expand && <i className="material-icons">zoom_in</i>}
            </div>
        </div>
        {/* 拡大時用 */}
        {expand && <div className="col s12 p0 border1 expand-hint">
            {/* <img src="/images/babylon/description/500.png" className="border1 stock-tile-sub" /> */}
            拡大表示中
        </div>}
    </>
}