import { useBabylonWebSocket } from "../../../../hooks/useBabylonWebSocket";
import { useStorage } from "../../../../hooks/useStorage";
import { Belvederes } from "../../meshes/Belvederes";
import { Bridge } from "../../meshes/Bridge";
import { BustStatue } from "../../meshes/BustStatue";
import { DoublePillar } from "../../meshes/DoublePillar";
import { Fountain } from "../../meshes/Fountain";
import { SinglePillar } from "../../meshes/SinglePillar";
import { Stairway } from "../../meshes/Stairway";
import { TerraceTile } from "../../meshes/TerraceTile";
import { PlayerBoardProps } from "../PlayerBoard";

type PlayerInfo = {playerId: string}
export const BabylonCanvasComponents = ({playerId, props}: PlayerInfo & {props?: PlayerBoardProps}) => {
    const {data, isBuildingPhase, isTurnPlayer} = useBabylonWebSocket();
    const playerInfo = data.playerInfoMap[playerId]!;
    const storage = useStorage()
    // 柱
    const previewPillar = isTurnPlayer && isBuildingPhase && playerInfo.selectTarget === "pillar" ? Object.entries(playerInfo.previewPillarMap) : []
    const selectedPillar = isBuildingPhase ? Object.entries(playerInfo.selectedPillarMap) : []
    const confirmedPillar = Object.entries(playerInfo.confirmedPillarMap)
    // タイル
    const previewTile =  isTurnPlayer && isBuildingPhase && playerInfo.selectTarget === "tile" ? Object.entries(playerInfo.previewTileMap) : []
    const selectedTile =  isBuildingPhase ? Object.entries(playerInfo.selectedTileMap) : []
    const confirmedTile = Object.entries(playerInfo.confirmedTileMap)
    // 選択中のタイルの周囲8座標を除外
    const expectTile = isTurnPlayer && isBuildingPhase ? [
        ...selectedTile.flatMap(([s, _]) => {
            const [x, y, z] = s.split(",").map(Number);
            return [ `${x},${y},${z}`, `${x + 1},${y},${z}`, `${x - 1},${y},${z}`, `${x},${y},${z + 1}`, `${x},${y},${z - 1}`,
                `${x + 1},${y},${z + 1}`, `${x - 1},${y},${z + 1}`, `${x + 1},${y},${z - 1}`, `${x - 1},${y},${z - 1}`, ];
        })
    ] : [];
    // コンポーネント
    const previewComponent =  isTurnPlayer && isBuildingPhase && playerInfo.selectTarget === "decoration" ? Object.entries(playerInfo.previewComponentMap).filter(([_, info]) => info.display) : []
    const selectedComponent =  isBuildingPhase ? Object.entries(playerInfo.selectedComponentMap).filter(([_, info]) => info.display) : []
    const confirmedComponent = Object.entries(playerInfo.confirmedComponentMap).filter(([_, info]) => info.display)


    // 選択中のコンポーネントの座標リスト
    const selectedPosList: string[] = []
    selectedComponent.forEach(([pos, info]) => {
        const [x,y,z,d] = pos.split(",").map(Number)
        selectedPosList.push(`${x},${y},${z}`)
        switch (info.symbol) {
            case "stairway":
                if (d === 0) selectedPosList.push(`${x},${y+1},${z+1}`)
                if (d === 1) selectedPosList.push(`${x+1},${y+1},${z}`)
                if (d === 2) selectedPosList.push(`${x},${y+1},${z-1}`)
                if (d === 3) selectedPosList.push(`${x-1},${y+1},${z}`)
                return
            case "fountain":
                if (d === 0) selectedPosList.push(`${x},${y},${z+1}`)
                if (d === 1) selectedPosList.push(`${x+1},${y},${z}`)
                if (d === 2) selectedPosList.push(`${x},${y},${z-1}`)
                if (d === 3) selectedPosList.push(`${x-1},${y},${z}`)
                return
            case "bridge":
                if (d === 0) {
                    selectedPosList.push(`${x},${y},${z+1}`)
                    selectedPosList.push(`${x},${y},${z+2}`)
                } else if (d === 1) {
                    selectedPosList.push(`${x+1},${y},${z}`)
                    selectedPosList.push(`${x+2},${y},${z}`)
                } else if (d === 2) {
                    selectedPosList.push(`${x},${y},${z-1}`)
                    selectedPosList.push(`${x},${y},${z-2}`)
                } else if (d === 3) {
                    selectedPosList.push(`${x-1},${y},${z}`)
                    selectedPosList.push(`${x-2},${y},${z}`)
                }
        }
    })

    return <>
        {/****************************************************************************************************/}
        {/* ストレージタイル */}
        {Object.keys(playerInfo.storageTiles).length > 0 && 
            <TerraceTile position={`8.4,0.1,0.5`} status={"storage-0"} tileInfo={playerInfo.storageTiles[0]} props={props} key={"storage-0"} />}
        {Object.keys(playerInfo.storageTiles).length > 1 &&
            <TerraceTile position={`9,0,2.5`} status={"storage-1"} tileInfo={playerInfo.storageTiles[1]} props={props} key={"storage-1"} /> }

        {/****************************************************************************************************/}
        {/* 柱: 確定 */}
        {confirmedPillar.filter(([_, h]) => h===1).map(([pos, _]) => <SinglePillar position={pos} key={`confirmed-single-${pos}`} status={"confirmed"} />)}
        {confirmedPillar.filter(([_, h]) => h===2).map(([pos, _]) => <DoublePillar position={pos} key={`confirmed-double-${pos}`} status={"confirmed"} />)}

        {/* 柱: プレビュー */}
        {previewPillar.filter(([_, display])=>display).map(([pos, _]) => <SinglePillar position={pos} key={`preview-pillar-${pos}`} status={"preview"} /> )}

        {/* 柱: 選択中 */}
        {selectedPillar.filter(([_, h]) => h===1).map(([pos, _]) => <SinglePillar position={pos} key={`selected-single-${pos}`} status={"selected"} />)}
        {selectedPillar.filter(([_, h]) => h===2).map(([pos, _]) => <DoublePillar position={pos} key={`selected-double-${pos}`} status={"selected"} /> )}

        {/* 柱: 所持 */}
        {[...Array(playerInfo.pillar).keys()].map(i=> i < 6
            ? <SinglePillar position={`8,0,${i*.8+3.2}`} key={`storage-pillar-${i}`} status={"confirmed"}/> 
            :<SinglePillar position={`9,0,${(i-6)*.8+4.4}`} key={`storage-pillar-${i}`} status={"confirmed"} />)}

        {/****************************************************************************************************/}
        {/* タイル: プレビュー */}
        {props && previewTile.length > 0 && props.selected > -1 &&
            previewTile
                .filter(([pos, display]) => display && !expectTile.includes(pos))
                .map(([pos, _])=><TerraceTile position={pos} status={"preview"} tileInfo={playerInfo.storageTiles[props.selected]} props={props} key={`preview-tile-${pos}`} />)}
        {/* タイル: 選択中 */}
        {selectedTile.map(([pos, info]) => <TerraceTile position={pos} status={"selected"} tileInfo={info} props={props} key={`selected-tile-${pos}-${info.rotate}`} /> )}
        {/* タイル: 確定 */}
        {confirmedTile.filter(([_, info]) => info.display).map(([pos, info]) => <TerraceTile position={pos} status={"confirmed"} tileInfo={info} props={props} key={`confirmed-tile-${pos}`} />)}

        {/****************************************************************************************************/}
        {/* コンポーネント: プレビュー */}
        {previewComponent.map(([pos, info]) => {
            // 選択中にある場合はスキップ
            const [x,y,z,d] = pos.split(",").map(Number)
            if (selectedPosList.includes(`${x},${y},${z}`)) return null
            switch (info.symbol) {
                case "stairway": 
                    if (d === 0 && selectedPosList.includes(`${x},${y+1},${z+1}`)) return null
                    if (d === 1 && selectedPosList.includes(`${x+1},${y+1},${z}`)) return null
                    if (d === 2 && selectedPosList.includes(`${x},${y+1},${z-1}`)) return null
                    if (d === 3 && selectedPosList.includes(`${x-1},${y+1},${z}`)) return null
                    return <Stairway position={pos} direction={info.direction} key={`stairway-${pos}`} status="preview" />
                case "fountain": 
                    if (d === 0 && selectedPosList.includes(`${x},${y},${z+1}`)) return null
                    if (d === 1 && selectedPosList.includes(`${x+1},${y},${z}`)) return null
                    if (d === 2 && selectedPosList.includes(`${x},${y},${z-1}`)) return null
                    if (d === 3 && selectedPosList.includes(`${x-1},${y},${z}`)) return null
                    return <Fountain position={pos} direction={info.direction} key={`fountain-${pos}`} status="preview" />
                case "bridge": 
                    if (d === 0 && selectedPosList.includes(`${x},${y},${z+1}`)) return null
                    if (d === 1 && selectedPosList.includes(`${x+1},${y},${z}`)) return null
                    if (d === 2 && selectedPosList.includes(`${x},${y},${z-1}`)) return null
                    if (d === 3 && selectedPosList.includes(`${x-1},${y},${z}`)) return null
                    if (d === 0 && selectedPosList.includes(`${x},${y},${z+2}`)) return null
                    if (d === 1 && selectedPosList.includes(`${x+2},${y},${z}`)) return null
                    if (d === 2 && selectedPosList.includes(`${x},${y},${z-2}`)) return null
                    if (d === 3 && selectedPosList.includes(`${x-2},${y},${z}`)) return null
                    return <Bridge position={pos} direction={info.direction} key={`bridge-${pos}`} status="preview" />
                case "statue": {
                    // 選択中の他の彫像がある場合、ルールを確認する
                        const statueList = selectedComponent.filter(([_, info]) => info.symbol === "statue").map(([pos, _]) => pos.split(",").map(Number));
                        const [x,y,z] = pos.split(",").map(Number)
                        if (statueList.length === 0) {
                            return <BustStatue position={pos} direction={info.direction} key={`statue-${pos}`} status="preview" />
                        }
                        for (let i=0;i<statueList.length;i++) {
                            const [dx, _, dz] = statueList[i]
                            if (x === dx || z === dz) {
                                return <BustStatue position={pos} direction={info.direction} key={`statue-${pos}`} status="preview" />
                            }
                        }
                    }
                    return null
                    
            }
            return null
        })}
        {/* コンポーネント: 選択中 */}
        {selectedComponent.map(([pos, info]) => {
            switch (info.symbol) {
                case "stairway": return <Stairway position={pos} direction={info.direction} key={`stairway-${pos}`} status="selected" />;
                case "statue": return <BustStatue position={pos} direction={info.direction} key={`statue-${pos}`} status="selected" />;
                case "fountain": return <Fountain position={pos} direction={info.direction} key={`fountain-${pos}`} status="selected" />;
                case "bridge": return <Bridge position={pos} direction={info.direction} key={`bridge-${pos}`} status="selected" />;
                case "belvederes": return <Belvederes position={pos} direction={info.direction} key={`belvederes-${pos}`}  status="selected" />;
            }
            return null
        })}
        {/* コンポーネント: 確定 */}
        {confirmedComponent.map(([pos, info]) => {
            switch (info.symbol) {
                case "stairway": return <Stairway position={pos} direction={info.direction} key={`stairway-${pos}`} status="confirmed" />;
                case "statue": return <BustStatue position={pos} direction={info.direction} key={`statue-${pos}`} status="confirmed" />;
                case "fountain": return <Fountain position={pos} direction={info.direction} key={`fountain-${pos}`} status="confirmed" />;
                case "bridge": return <Bridge position={pos} direction={info.direction} key={`bridge-${pos}`} status="confirmed" />;
                case "belvederes": return <Belvederes position={pos} direction={info.direction} key={`belvederes-${pos}`}  status="confirmed" />;
            }
            return null
        })}
    </>
}