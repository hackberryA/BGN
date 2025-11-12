import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { width } from "./common";
import { CommonMesh } from "./CommonMesh";
import { ComponentType } from "./types";

export function SinglePillar({ position, direction, status }: ComponentType) {
  const [x,y,z] = position.split(",").map(Number);
  const {send, currentPlayerInfo: playerInfo} = useBabylonWebSocket();

  const normalMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/wall-map.png");
  const shaftGeometry = useMemo(() => new THREE.CylinderGeometry(3.2, 4, 13, 100, 1, true), []);
  // ------------------------------------------------------------
  // クリック時
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!playerInfo) return
    if (playerInfo.selectTarget !== "pillar") return;

    const parent = e.parent;
    if (parent) { parent.remove(e); }
    send("selectPillar", {x,y,z})
  }
  // ------------------------------------------------------------
  return <CommonMesh name="singlePillar" position={position} direction={direction} status={status}
    meshList={[
      {position: [0, 8.0,  0], materialParameters: {normalMap}, geometry: shaftGeometry},
      {position: [0, 14.5, 0], materialParameters: {normalMap}, geometry: new RoundedBoxGeometry(width/2-2, 1.5, width/2-2, 1, -0.2)},
      {position: [0, 2.0,  0], materialParameters: {normalMap}, geometry: new RoundedBoxGeometry(width / 2, 2, width / 2, 1, -0.2)},
    ]}
    onClick={handleClick}
    // onPointerOver={status === "preview" ? handlePointerOver : () => {}}
    // onPointerOut={status === "preview" ? handlePointerOut : () => {}}
  />
}
