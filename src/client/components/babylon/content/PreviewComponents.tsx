import { TerraceTileInfo } from "../../../types/BabylonTypes";
import { randInt } from "../../../utils/CommonUtils";
import { FlowerType } from "../const/flowers";
import { LayerType } from "../const/layers";
import { SymbolType } from "../const/symbols";
import { Belvederes } from "../meshes/Belvederes";
import { Bridge } from "../meshes/Bridge";
import { BustStatue } from "../meshes/BustStatue";
import { DoublePillar } from "../meshes/DoublePillar";
import { Fountain } from "../meshes/Fountain";
import { SinglePillar } from "../meshes/SinglePillar";
import { Stairway } from "../meshes/Stairway";
import { Statue } from "../meshes/Statue";
import { TerraceTile } from "../meshes/TerraceTile";

const LAYERS: LayerType[] = ["clay", "granite", "basalt"];
const FLOWERS: FlowerType[] = ["red", "white", "blue", "yellow"];
const SYMBOLS: SymbolType[] = ["stairway", "fountain", "statue", "bridge", "empty"];

export const PreviewComponents = () => {
    return <>
        {/* オブジェクトを並べる */}
        <SinglePillar key={`pj-1`} position={"0,0,0"} status="confirmed"/>
        <DoublePillar key={`pj-2`} position={"1,0,0"} status="confirmed"/>
        <Belvederes key={`pj-3`} position={"2,0,0"} status="confirmed"/>
        <Stairway key={`pj-4`} position={"3,0,0,0"} status="confirmed" direction={0} />
        <Fountain key={`pj-5`} position={"4,0,0"} status="confirmed" direction={0} />
        <Bridge key={`pj-6`} position={"5,0,0"} status="confirmed" direction={0} />
        <BustStatue key="pj-7" position="6,0,0" />

        {/* ストレージタイル */}
        <TerraceTile key="pt-8.4,0,0.5" position={"8.4,0,0.5"} status={"storage-0"} 
            tileInfo={{ tileNo: 0, layer: "starting", flower: "red", symbols: ["fountain", "bridge", "statue", "stairway"], display: true, rotate: 0 }} />
        <TerraceTile key="pt-9,0,2.5" position={"9,0,2.5"} status={"storage-1"} 
            tileInfo={{ tileNo: 0, layer: "clay", flower: "red", symbols: ["fountain", "empty", "statue", "empty"], display: true, rotate: 0 }} />
        {/* 柱1 */}
        {[
            "8,0,3.2", "8,0,4", "8,0,4.8", "8,0,5.6", // ストレージ
            "0,0,6","1,0,7","1,0,6","0,0,5","0,0,4","1,0,5","1,0,4","3,0,6","3,0,7","4,0,6","0,1,4","1,1,4",
            "3,0,3","3,0,4","4,0,3","4,0,4","5,0,3","5,0,4","6,0,3","6,0,4","6,0,5","7,0,6","7,0,5",
            "3,1,3","3,1,4","1,2,3","2,2,3","2,2,4"
        ].map(pos=> <SinglePillar key={`psp-${pos}`} position={pos} status="confirmed"/> )}
        {/* 柱2 */}
        {["0,0,3","1,0,3","2,0,4","2,0,3","4,1,3","4,1,4","5,1,3"].map((pos)=>
            <DoublePillar key={`pdp-${pos}`} position={pos} status="confirmed"/>
        )}
        {/* テラスタイル */}
        {["0,1,6","0,1,4","3,1,6","3,1,3","5,1,3","6,1,5",
            "0,2,3","2,2,3","1,3,3","4,3,3"].map((pos,index)=>
            <TerraceTile key={`pt-${pos}`} position={pos} status={"confirmed"} tileInfo={{ tileNo: 0, display: true, rotate: index%4,
                layer: LAYERS[index%3],
                flower: FLOWERS[index%4],
                symbols: [SYMBOLS[index%5], "empty", SYMBOLS[(index+1)%5], SYMBOLS[(index+2)%5]],
            } as TerraceTileInfo} />
        )}
        {/* 展望台 */}
        {["0,1,7", "4,1,7", "6,1,6", "1,3,4", "5,3,4"].map((pos)=>
            <Belvederes key={`pbl-${pos}`} position={pos} status="confirmed" direction={0} />
        )}
        {/* 階段 */}
        {[["1,1,5,2",2],["3,2,4,1",1]].map((v)=>
            <Stairway key={`psw-${v[0]}`} position={v[0] as string} status="confirmed" direction={v[1] as number} />
        )}
        {/* 噴水 */}
        {[["0,1,5,0",0], ["6,1,4,0",0]].map((v)=>
            <Fountain key={`pft-${v[0]}`} position={v[0] as string} status="confirmed" direction={v[1] as number} />
        )}
        {/* 橋 */}
        <Bridge key={`pbd-1`} position={"1,1,6"} status="confirmed" direction={1} />
        <Bridge key={`pbd-2`} position={"2,3,3"} status="confirmed" direction={1} />
        {/* 彫像 */}
        <BustStatue key={`pstt-1`} position="3,1,7,0" direction={2} status="confirmed" />
        <BustStatue key={`pstt-2`} position="3,2,3,0" direction={2} status="confirmed" />
        <BustStatue key={`pstt-3`} position="5,3,3,0" direction={2} status="confirmed" />
        <BustStatue key={`pstt-4`} position="6,1,3,0" direction={2} status="confirmed" />
    </>
}