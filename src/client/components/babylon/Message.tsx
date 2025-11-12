import { ReactNode, useEffect, useState } from "react";
import { BabylonDataType, TerraceTileInfo } from "../../types/BabylonTypes";
import { useBabylonWebSocket } from "../../hooks/useBabylonWebSocket";
import { useStorage } from "../../hooks/useStorage";
import { QuarryCanvasProps } from "./content/QuarryCanvas";
import { CurrentPlayerName } from "./content/PlayerName";
import { LAYER } from "./const/layers";
import { FLOWER } from "./const/flowers";
import { SYMBOLS } from "./const/symbols";
import { PlayerBoardProps } from "./content/PlayerBoard";

type MessageProps = {
    quarryProps: QuarryCanvasProps;
    playerBoardProps?: PlayerBoardProps;
}
const Message = ({quarryProps, playerBoardProps}: MessageProps) => {
    const {data: {roomStatus, phase}} = useBabylonWebSocket();
    return (
        <div className="row">
            <div className="col s12 yellow lighten-3 valign-wrapper center" style={{height: "35px", width: "100%" }} >
                {roomStatus === "waiting" && <WaitingMessageButtons />}
                {roomStatus === "progress" && <>
                    {/* 採石場セットアップ */}
                    {phase === "setup" && <SetupMessageButtons quarryProps={quarryProps} />}
                    {/* 採石フェーズ */}
                    {phase === "quarry" && <QuarryMessageButtons quarryProps={quarryProps} />}
                    {/* 建築フェーズ */}
                    {(phase === "building") && <BuildingMessageButtons quarryProps={quarryProps} playerBoardProps={playerBoardProps}/>}
                </>}
            </div>
        </div>
    )
}
export default Message

type MsgProps = {children?: ReactNode}
const Msg = ({children}: MsgProps) => {
    return <h6 className="center-align m0" style={{lineHeight: "35px"}}>{children}</h6>
}
type BtnProps = {msg?: string, name: string, clickHandle: () => void, color?: string, disabled?: boolean}
const Btn = ({name, clickHandle, color="green", disabled=false}: BtnProps) => {
    return <button 
        className={`btn waves-effect waves-light btn-small ${color} darken-1`} 
        style={{marginLeft: "10px"}}
        onClick={clickHandle}
        disabled={disabled}
        children={name} />
}

const Remarks = ({msg}: {msg: string}) => <span style={{paddingLeft: "10px", fontSize: "10px", color: "grey"}}>({msg})</span>
const getQuarryTile = (quarry: TerraceTileInfo[]) => {
    return (quarry[0].display) ? quarry[0]
        : (quarry[1].display) ? quarry[1]
        : (quarry[2].display) ? quarry[2]
        : {layer: "bedrock", flower: "none", symbols: [], display: false};
}

/** ゲーム待機中 */
const WaitingMessageButtons = () => {
    const {send, data, playerLength} = useBabylonWebSocket();
    const storage = useStorage()
    return <>
        {/* メッセージ */}
        <Msg>開始待機中</Msg>
        {/* 参加前 */}
        {!data.playerIds.includes(storage.userId) && playerLength < 4 && <Btn clickHandle={()=>send("joinGame")} name="ゲームに参加する" />}
        {/* 参加中 */}
        {data.playerIds.includes(storage.userId) && <Btn clickHandle={()=>send("notJoinGame")} name="やっぱやめる" />}
        {/* 部屋主 */}
        {<Btn clickHandle={()=>send("startGame")} name="ゲーム開始" color="blue" disabled={playerLength == 0 || !data.userInfoMap[storage.userId]?.auth} />}
        {/* 補足 */}
        {<Remarks msg="プレイ順はシャッフルされます" />}

    </>
}

/** 採石場セットアップ */
const SetupMessageButtons = ({quarryProps}: MessageProps) => {
    const {send, data, userLength, playerLength} = useBabylonWebSocket();
    const {selected, setSelected} = quarryProps;
    const storage = useStorage()
    
    const confirmRemoveTile = () => {
        send("removeTile", {index: quarryProps.selected})
        quarryProps.setSelected(-1)
    }
    if (selected < 0) {
        return <Msg><CurrentPlayerName/> は採掘場から捨てるタイルを選択してください。（残り{data.removeQuarry}枚）</Msg>;
    }
    const quarry = getQuarryTile(data.quarry[selected]);
    return <> 
        {storage.userId !== data.playerIds[data.playerIndex] || quarryProps.selected < 0
            ? <Msg><CurrentPlayerName/> は採掘場から捨てるタイルを選択してください。（残り{data.removeQuarry}枚）</Msg>
            : <>
                {quarry.layer === "clay" && <Msg>
                    選択中のタイル【
                        {LAYER[quarry.layer]}｜
                        {FLOWER[quarry.flower]}｜
                        {quarry.symbols.filter(v=>v!=="empty").map(symbol=>SYMBOLS[symbol]).join("、")}
                    】を除外します。
                </Msg>}
                {quarry.layer !== "clay" && <Msg>粘土タイルを選択してください。</Msg>}
                <Btn clickHandle={confirmRemoveTile} name="確定" disabled={quarry.layer !== "clay"} />
            </>
        }
    </>
}

const LAYER_NUMBER: Record<string, number> = {clay: 3, granite: 2, basalt: 1, bedrock: 0}

/** 採石フェーズ */
const QuarryMessageButtons = ({quarryProps}: MessageProps) => {
    const {send, data, userLength, playerLength} = useBabylonWebSocket();
    const storage = useStorage()
    const {selected, setSelected} = quarryProps;
    if (selected < 0) {
        return <Msg><CurrentPlayerName/> は採掘場からタイルを獲得できます。</Msg>;
    }
    const quarry = getQuarryTile(data.quarry[selected]);
    if (!quarry) {
        return <Msg><CurrentPlayerName/> は採掘場からタイルを獲得できます。</Msg>;
    }

    // 獲得する柱の数を計算する
    //  0  1  2  3
    //  4  5  6  7
    //  8  9 10 11
    // 12 13 14 15
    let pillar = 0;
    // *** 壁に隣接 ***
    // 壁
    if ([0,1,2,3,4,7,8,11,12,13,14,15].includes(selected)) pillar++;
    // 角
    if ([0,3,12,15].includes(selected)) pillar++;
    // *** 隣接タイルが同階層以下 ***
    // 上
    if (selected > 3) {
        const q = getQuarryTile(data.quarry[selected - 4]);
        if (LAYER_NUMBER[quarry.layer] >= LAYER_NUMBER[q.layer]) pillar++;
    }
    // 左
    if (selected % 4 > 0) {
        const q = getQuarryTile(data.quarry[selected - 1]);
        if (LAYER_NUMBER[quarry.layer] >= LAYER_NUMBER[q.layer]) pillar++;
    }
    // 右
    if (selected % 4 < 3) {
        const q = getQuarryTile(data.quarry[selected + 1]);
        if (LAYER_NUMBER[quarry.layer] >= LAYER_NUMBER[q.layer]) pillar++;
    }
    // 下
    if (selected < 12) {
        const q = getQuarryTile(data.quarry[selected + 4]);
        if (LAYER_NUMBER[quarry.layer] >= LAYER_NUMBER[q.layer]) pillar++;
    }
    // *** 花が一致 ***
    if (quarry.flower === data.playerInfoMap[storage.userId].flower) pillar++;

    const confirmSelectedTile = () => {
        send("getTile", {index: quarryProps.selected, pillar})
        quarryProps.setSelected(-1)
    }
    return <>
        {storage.userId !== data.playerIds[data.playerIndex] || quarryProps.selected < 0
            ? <Msg><CurrentPlayerName/> は採掘場からタイルを獲得できます。</Msg>
            : <>
                <Msg>
                    タイル【
                        {LAYER[quarry.layer]}｜
                        {FLOWER[quarry.flower]}｜
                        {quarry.symbols.filter(v=>v!=="empty").map(symbol=>SYMBOLS[symbol]).join("、")}
                    】
                    と柱{pillar}個を獲得します。
                </Msg>
                <Btn clickHandle={confirmSelectedTile} name="確定" />
            </>
        }
    </>
}

// 建築フェーズ
const BuildingMessageButtons = ({playerBoardProps}: MessageProps) => {
    const {send, playerInfo, isTurnPlayer} = useBabylonWebSocket();
    const [waiting, setWaiting] = useState(false)
    const clickHander = (type: string, data: any={}) => () => {
        playerBoardProps?.setSelected(-1)
        send(type, data)
        setWaiting(true)
        setTimeout(()=>{ setWaiting(false) }, 500)
    }

    if (waiting) return <></>
    if (!playerInfo) return <></>
    if (playerInfo.selectTarget === "pillar") {
        return <>
            <Msg><CurrentPlayerName/> は柱を設置できます。</Msg>
            {isTurnPlayer && <>
                {/* タイルが置けない配置の場合 disabled */}
                <Btn clickHandle={clickHander("confirmPillar")} name="確定" 
                        disabled={Object.keys(playerInfo.previewTileMap).length == 0}/>
                <Btn clickHandle={clickHander("resetPillar")} name="リセット" color="blue"/>
                {/* 柱を未設置 */}
                {playerInfo.storageTiles.length == 1 
                    ? <Btn clickHandle={clickHander("finishWithoutBuilding")} name="柱を設置せずにターン終了" color="red"/>
                    : <Btn clickHandle={clickHander("discarding")} name="柱を設置しない" color="red"/>
                }
            </>}
        </>
    } else if (playerInfo.selectTarget === "tile") {
        return <>
            {isTurnPlayer && <>
                {/* タイルを配置していない場合 disabled */}
                <Btn clickHandle={clickHander("confirmTile")} name="確定"
                    disabled={Object.keys(playerInfo.selectedTileMap).length == 0} />
                <Btn clickHandle={clickHander("resetTile")} name="タイルをリセット" color="blue"/>
                <Btn clickHandle={clickHander("resetTurn")} name="最初からやり直す" color="red"/>
                <Remarks msg="タイルのない柱は回収されます。" />
            </>}
        </>
    } else if (playerInfo.selectTarget === "decoration") {
        return <>
            {Object.keys(playerInfo.previewComponentMap).length > 0
                ? <Msg><CurrentPlayerName/> は装飾を設置できます。</Msg>
                : <Msg>設置できる装飾はありません。</Msg>
            }
            {isTurnPlayer && <>
                <Btn clickHandle={clickHander("confirmTurn")} name="確定（ターン終了）" />
                <Btn clickHandle={clickHander("resetTurn")} name="最初からやり直す" color="red"/>
            </>}
        </>
    } else if (playerInfo.selectTarget === "discarding") {
        return <>
            <Msg><CurrentPlayerName/> は捨てるタイルを選択してください。</Msg>
            {isTurnPlayer && <>
                <Btn clickHandle={clickHander("confirmTurn", {selected: playerBoardProps?.selected})} name="確定（ターン終了）" 
                    disabled={!playerBoardProps || playerBoardProps?.selected < 0}/>
                <Btn clickHandle={clickHander("resetTurn")} name="最初からやり直す" color="red"/>
            </>}
        </>
    } else {
        return <></>
    }
}
