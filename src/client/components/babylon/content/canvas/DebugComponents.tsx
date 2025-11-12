import { useBabylonWebSocket } from "../../../../hooks/useBabylonWebSocket";
import { useStorage } from "../../../../hooks/useStorage";
import { DebugBox } from "../../meshes/DebugBox";

type PlayerInfo = {playerId: string}
export const DebugComponents = ({playerId}: PlayerInfo) => {
    const {data, isBuildingPhase} = useBabylonWebSocket();
    const playerInfo = data.playerInfoMap[playerId]!;
    const storage = useStorage()
    const previewPillar = isBuildingPhase && storage.userId === playerId && playerInfo.selectTarget === "pillar" ? Object.entries(playerInfo.previewPillarMap) : []
    const previewComponent =  isBuildingPhase && playerInfo.selectTarget === "decoration" ? Object.entries(playerInfo.previewComponentMap) : []
    const confirmedComponent = Object.entries(playerInfo.confirmedComponentMap)
    const selectedComponent =  isBuildingPhase ? Object.entries(playerInfo.selectedComponentMap).filter(([_, info]) => info.display) : []

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
        {previewPillar.filter(([_, display])=>display).map(([pos, _]) => {
            if (pos in playerInfo.confirmedTileMap) {
                const info = playerInfo.confirmedTileMap[pos]
                switch (info.symbols[0]) {
                    case "stairway":
                    case "fountain":
                    case "statue":
                    case "bridge":
                        return <DebugBox position={pos} key={`debug-box-${pos}`} symbol={info.symbols[0]} />
                    case "belvederes":
                    case "empty":
                        return <DebugBox position={pos} key={`debug-box-${pos}`} />
                }

            } else {
                return <DebugBox position={pos} key={`debug-box-${pos}`} />
            }
        } )}
        {previewComponent.map(([pos, info]) => {
            const [x,y,z,d] = pos.split(",").map(Number)
            if (selectedPosList.includes(`${x},${y},${z}`)) return null
            switch (info.symbol) {
                case "stairway":
                    if (d === 0) {
                        if (selectedPosList.includes(`${x},${y+1},${z+1}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-stairway-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x},${y+1},${z+1}`} key={`debug-stairway-${pos}-2`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 1) {
                        if (selectedPosList.includes(`${x+1},${y+1},${z}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-stairway-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x+1},${y+1},${z}`} key={`debug-stairway-${pos}-2`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 2) {
                        if (selectedPosList.includes(`${x},${y+1},${z-1}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-stairway-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x},${y+1},${z-1}`} key={`debug-stairway-${pos}-2`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 3) {
                        if (selectedPosList.includes(`${x-1},${y+1},${z}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-stairway-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x-1},${y+1},${z}`} key={`debug-stairway-${pos}-2`} symbol={info.symbol}/>
                        </>
                    }
                    return null
                case "fountain":
                    if (d === 0) {
                        if (selectedPosList.includes(`${x},${y},${z+1}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-fountain-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x},${y},${z+1}`} key={`debug-fountain-${pos}-2`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 1) {
                        if (selectedPosList.includes(`${x+1},${y},${z}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-fountain-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x+1},${y},${z}`} key={`debug-fountain-${pos}-2`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 2) {
                        if (selectedPosList.includes(`${x},${y},${z-1}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-fountain-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x},${y},${z-1}`} key={`debug-fountain-${pos}-2`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 3) {
                        if (selectedPosList.includes(`${x-1},${y},${z}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-fountain-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x-1},${y},${z}`} key={`debug-fountain-${pos}-2`} symbol={info.symbol}/>
                        </>
                    }
                    return null
                case "bridge":
                    if (d === 0) {
                        if (selectedPosList.includes(`${x},${y},${z+1}`)) return null
                        if (selectedPosList.includes(`${x},${y},${z+2}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-bridge-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x},${y},${z+1}`} key={`debug-bridge-${pos}-2`} symbol={info.symbol}/>
                            <DebugBox position={`${x},${y},${z+2}`} key={`debug-bridge-${pos}-3`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 1) {
                        if (selectedPosList.includes(`${x+1},${y},${z}`)) return null
                        if (selectedPosList.includes(`${x+2},${y},${z}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-bridge-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x+1},${y},${z}`} key={`debug-bridge-${pos}-2`} symbol={info.symbol}/>
                            <DebugBox position={`${x+2},${y},${z}`} key={`debug-bridge-${pos}-3`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 2) {
                        if (selectedPosList.includes(`${x},${y},${z-1}`)) return null
                        if (selectedPosList.includes(`${x},${y},${z-2}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-bridge-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x},${y},${z-1}`} key={`debug-bridge-${pos}-2`} symbol={info.symbol}/>
                            <DebugBox position={`${x},${y},${z-2}`} key={`debug-bridge-${pos}-3`} symbol={info.symbol}/>
                        </>
                    }
                    if (d === 3) {
                        if (selectedPosList.includes(`${x-1},${y},${z}`)) return null
                        if (selectedPosList.includes(`${x-2},${y},${z}`)) return null
                        return <>
                            <DebugBox position={pos} key={`debug-bridge-${pos}`} symbol={info.symbol}/>
                            <DebugBox position={`${x-1},${y},${z}`} key={`debug-bridge-${pos}-2`} symbol={info.symbol}/>
                            <DebugBox position={`${x-2},${y},${z}`} key={`debug-bridge-${pos}-3`} symbol={info.symbol}/>
                        </>
                    }
                    return null
                case "statue":{
                    // 選択中の他の彫像がある場合、ルールを確認する
                        const statueLength = confirmedComponent.filter(([_, info]) => info.symbol === "statue").length;
                        const statueList = selectedComponent.filter(([_, info]) => info.symbol === "statue").map(([pos, _]) => pos.split(",").map(Number));
                        const [x,y,z] = pos.split(",").map(Number)
                        if (statueLength === 0 && statueList.length === 0) {
                            return <DebugBox position={pos} key={`debug-statue-${pos}`} symbol={"statue"}/>
                        }
                        for (let i=0;i<statueList.length;i++) {
                            const [dx, _, dz] = statueList[i]
                            if (x === dx || z === dz) {
                                return <DebugBox position={pos} key={`debug-statue-${pos}`} symbol={"statue"}/>
                            }
                        }
                        return null
                    }
                default: 
                    return <DebugBox position={pos} key={`debug-box-${pos}`} symbol={info.symbol}/>
            }
        } )}
    </>
}