import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { height, width } from "./common";
import { CommonMesh } from "./CommonMesh";
import { ComponentType } from "./types";
import { useVRMScene } from "./useVRMScene";

export const BustStatue = ({position, direction=0, status="confirmed"}: ComponentType) => {
    
    // 座標
    const [x,y,z,d] = position.split(",").map(Number);
    const pos: [x:number, y:number, z:number] = [ width * (x - 3.5), height * y + 1 , width * (z - 3.5) ]

    const {send, currentPlayerInfo: playerInfo} = useBabylonWebSocket();

    const scene = useVRMScene("/vrm/nanoha1013.vrm")

    const waterMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/water-map1.png");
    const wallMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/wall-map.png");
     // ------------------------------------------------------------
    // クリック時
    const handleClick = (e: any) => {
        e.stopPropagation();
        if (!playerInfo) return
        if (playerInfo.selectTarget !== "decoration") return

        const parent = e.parent;
        if (parent) { parent.remove(e); }
        send("selectStatue", {position})
    }
    // ------------------------------------------------------------ 
    return (
        <CommonMesh name="statue" position={position} direction={direction} status={status}
            meshList={[
                { geometry: new RoundedBoxGeometry(width / 2, 1, width / 2, 1, -0.2), position: [0,1,0], materialParameters: {normalMap: waterMap} },
                { geometry: new RoundedBoxGeometry(width/2-2, 6, width/2-2, 1, -0.2), position: [0,3.5,0], materialParameters: {normalMap: wallMap} },
                { geometry: new RoundedBoxGeometry(width/3, .8, width/3, 1, -0.2), position: [0,6.8,0], materialParameters: {normalMap: wallMap} },
            ]}
            onClick={handleClick}
            statue={scene && (
                <group position={[0,-7,0]}>
                    <primitive scale={12} object={scene} />
                </group>
            )}
        />
    )
};
