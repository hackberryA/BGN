// Stair.tsx
import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { commonShadow, defaultMaterialParameters } from "../const/mesh";
import { height, width } from "./common";
import { ComponentType } from "./types";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { CommonMesh } from "./CommonMesh";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";

export function Fountain({position, direction = 0, status }: ComponentType) {
  const {send, currentPlayerInfo: playerInfo} = useBabylonWebSocket();
  const [x,y,z,d] = position.split(",").map(Number);
  const pos: [x:number,y:number,z:number] = [ width * (x - 3.5), height * y , width * (z - 3.5) ]
  const groupRef = useRef<any>(null!);
  const waterMap1 = useLoader(THREE.TextureLoader, "/images/babylon/textures/water-map1.png");
  const waterMap2 = useLoader(THREE.TextureLoader, "/images/babylon/textures/water-map2.png");
  
  // ------------------------------------------------------------
  // クリック時
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!playerInfo) return
    if (playerInfo.selectTarget !== "decoration") return;

    const parent = e.parent;
    if (parent) { parent.remove(e); }
    send("selectFountain", {position})
  } 
  // ------------------------------------------------------------
  return (
        <CommonMesh name="fountain" position={`${x},${y},${z}`} direction={direction} status={status}
        onClick={handleClick}
        meshList={[
          // 床
          {
            position: [0, 1, 0], rotation: [0, Math.PI*9/8,0],
            geometry: new THREE.CylinderGeometry(width/3.7+.8, width/3.7+.8, 1, 8, 1, false, -Math.PI*5/8, Math.PI),
          },
          {
            position: [0, 1, width], rotation: [0, Math.PI/8,0],
            geometry: new THREE.CylinderGeometry(width/3.7+.8, width/3.7+.8, 1, 8, 1, false, -Math.PI*5/8, Math.PI),
          },
          {
            position: [0, 2, 0], rotation: [0, Math.PI/8,0],
            geometry: new THREE.CylinderGeometry(width/3.7+.5, width/3.7+.5, 1, 8, 1, false, Math.PI*3/8, Math.PI),
            materialParameters: {normalMap: waterMap1},
          },
          {
            position: [0, 2, width], rotation: [0, Math.PI/8,0],
            geometry: new THREE.CylinderGeometry(width/3.7+.5, width/3.7+.5, 1, 8, 1, false, -Math.PI*5/8, Math.PI),
            materialParameters: {normalMap: waterMap1},
          },
          {
            position: [0, 1, width/2],
            geometry: new THREE.BoxGeometry(width/2+2.4, 1, width),
          },
          {
            position: [0, 2, width/2],
            geometry: new THREE.BoxGeometry(width/2+1.8, 1, width),
            materialParameters: {normalMap: waterMap2},
          },
          // 壁1
          {geometry: new THREE.BoxGeometry(0.5, 2.0, 25), materialParameters: {normalMap: waterMap2}, position: [width/4, 2.6, width/2]},
          {geometry: new THREE.BoxGeometry(0.5, 2.0, 25), materialParameters: {normalMap: waterMap2}, position: [-width/4, 2.6, width/2]},
          {geometry: new THREE.BoxGeometry(5.0, 2.0, 0.5), materialParameters: {normalMap: waterMap2}, position: [0, 2.6, -width/4]},
          {geometry: new THREE.BoxGeometry(5.0, 2.0, 0.5), materialParameters: {normalMap: waterMap2}, position: [0, 2.6, width*5/4]},
          // 壁2
          {geometry: new THREE.BoxGeometry(4.0, 2.0, 0.5), materialParameters: {normalMap: waterMap2}, position: [ width*3/16, 2.6, width*19/16], rotation: [0,Math.PI/4,0]},
          {geometry: new THREE.BoxGeometry(4.0, 2.0, 0.5), materialParameters: {normalMap: waterMap2}, position: [-width*3/16, 2.6, width*19/16], rotation: [0,-Math.PI/4,0]},
          {geometry: new THREE.BoxGeometry(4.0, 2.0, 0.5), materialParameters: {normalMap: waterMap2}, position: [ width*3/16, 2.6, -width*3/16], rotation: [0,-Math.PI/4,0]},
          {geometry: new THREE.BoxGeometry(4.0, 2.0, 0.5), materialParameters: {normalMap: waterMap2}, position: [-width*3/16, 2.6, -width*3/16], rotation: [0,Math.PI/4,0]},
          // 壁柱
          {geometry: new THREE.BoxGeometry(0.5, 3.0, 0.5), position: [ width/4, 2.8, -width/8] },
          {geometry: new THREE.BoxGeometry(0.5, 3.0, 0.5), position: [-width/4, 2.8, -width/8] },
          {geometry: new THREE.BoxGeometry(0.5, 3.0, 0.5), position: [ width/4, 2.8, width*9/8] },
          {geometry: new THREE.BoxGeometry(0.5, 3.0, 0.5), position: [-width/4, 2.8, width*9/8] },
          {geometry: new THREE.BoxGeometry(0.5, 3.0, 0.5), position: [ 2, 2.8, -width/4] },
          {geometry: new THREE.BoxGeometry(0.5, 3.0, 0.5), position: [-2, 2.8, -width/4] },
          {geometry: new THREE.BoxGeometry(0.5, 3.0, 0.5), position: [ 2, 2.8, width*5/4] },
          {geometry: new THREE.BoxGeometry(0.5, 3.0, 0.5), position: [-2, 2.8, width*5/4] },
          // 中心部
          {
            position: [0, 4, width/2],
            geometry: new THREE.SphereGeometry(4, 8, 8, 0, Math.PI * 2, 1.57, 1.5),
            materialParameters: {wireframe:false, side: THREE.DoubleSide},
          },
          {geometry: new RoundedBoxGeometry(6, 1, 6, 1, 2), materialParameters: {normalMap: waterMap1}, position: [0, 4, width/2]},
          {geometry: new RoundedBoxGeometry(6, 3, 6, 1, 2), materialParameters: {normalMap: waterMap1}, position: [0, 3, width/2], rotation: [0,Math.PI/4,0]},
          {geometry: new THREE.CylinderGeometry(3.5, 3.5, .5, 8, 1, false), materialParameters: {normalMap: waterMap1}, position: [0, 4, width/2]},
          {geometry: new THREE.CylinderGeometry(2, 2, .5, 8, 1, false), materialParameters: {normalMap: waterMap1}, position: [0, 5, width/2]},
          {geometry: new THREE.CylinderGeometry(1.4, 1.8, 2.5, 4, 1, false), position: [0, 6.5, width/2], rotation: [0,Math.PI/4,0]},
          {geometry: new RoundedBoxGeometry(3, .3, 3, 1, -.1), materialParameters: {normalMap: waterMap1}, position: [0, 7.5, width/2]},
          {geometry: new RoundedBoxGeometry(2, .3, 2, 1, -.1), materialParameters: {normalMap: waterMap1}, position: [0, 8, width/2]},
          {geometry: new THREE.SphereGeometry(.7, 10, 10), materialParameters: {normalMap: waterMap1}, position: [0, 8.6, width/2]},
        ]}
    />
  )
}
