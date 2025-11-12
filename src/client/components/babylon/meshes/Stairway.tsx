// Stair.tsx
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { height, width } from "./common";
import { CommonMesh } from "./CommonMesh";
import { ComponentType } from "./types";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";

export function Stairway({position, direction = 0, status }: ComponentType) {
  const {send, currentPlayerInfo: playerInfo} = useBabylonWebSocket();
  
  const [x,y,z,d] = position.split(",").map(Number);
  const normalMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/wall-map.png");
  const normalMap2 = useLoader(THREE.TextureLoader, "/images/babylon/textures/water-map2.png");

  // 段差
  const steps = 20;
  const stepWidth = (width * 0.75) / steps;
  const stepHeight = height / (steps - 1);
  const stepMeshes = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= steps; i++) {
      arr.push({
        args: [(i < 15 ? 7-i/12 : 8), stepHeight * i, stepWidth] as [number, number, number],
        position: [0, (stepHeight / 2) * i, stepWidth * (i - 7)] as [number, number, number],
      });
      if (i>1) {
        arr.push({
          args: [.5, stepHeight * i + 2, 1] as [number, number, number],
          position: [2.3 + Math.tan(1-i/20)**2, (stepHeight / 2) * i, stepWidth * (i - 7)] as [number, number, number],
        });
        arr.push({
          args: [.5, stepHeight * i + 2, 1] as [number, number, number],
          position: [-2.3 - Math.tan(1-i/20)**2, (stepHeight / 2) * i, stepWidth * (i - 7)] as [number, number, number],
        });
      }
    }
    return arr;
  }, [steps, width, height]);
  // ------------------------------------------------------------
  // クリック時
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!playerInfo) return
    if (playerInfo.selectTarget !== "decoration") return;

    const parent = e.parent;
    if (parent) { parent.remove(e); }
    send("selectStairway", {position})
  }
  // ------------------------------------------------------------
  return (
    <CommonMesh name="stairway" position={`${x},${y},${z}`} direction={d} status={status}
      onClick={handleClick}
      meshList={[
        // 床
        {position: [0, 1, 2], geometry: new RoundedBoxGeometry(10, .7, 16, 1, -0.2), materialParameters: {normalMap: normalMap2}},
        {position: [0, height + 1, width - 2.5], geometry: new RoundedBoxGeometry(10, .7, 16, 1, -0.2), materialParameters: {normalMap: normalMap2}},
        // 柱
        {position: [0, height/2-2, 9], geometry: new RoundedBoxGeometry(width/2, height-4, 2, 1, -0.2), materialParameters: {normalMap}},
        {position: [0, height-4, 8.5], geometry: new RoundedBoxGeometry(width/2+1, .5, 3, 1, -0.2), materialParameters: {normalMap}},
        {position: [0, 2, 6], geometry: new RoundedBoxGeometry(width/2, .5, 3, 1, -0.2), materialParameters: {normalMap}},
        {position: [0, height/4, 6], geometry: new RoundedBoxGeometry(width/2-1, height/2, 2, 2, 5), materialParameters: {normalMap}},
        {position: [0, height/2, 6], geometry: new RoundedBoxGeometry(width/2+1, .5, 3, 1, -0.2), materialParameters: {normalMap}},
        // 段差
        ...stepMeshes.map((s) => ({
          position: s.position,
          geometry: new THREE.BoxGeometry(...s.args),
          materialParameters: {normalMap}
        }))
      ]} 
    />
  )
}
