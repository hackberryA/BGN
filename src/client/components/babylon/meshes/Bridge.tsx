// Stair.tsx
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { width } from "./common";
import { CommonMesh } from "./CommonMesh";
import { ComponentType } from "./types";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";

export function Bridge({position, direction = 0, status }: ComponentType) {
    const {send, currentPlayerInfo: playerInfo} = useBabylonWebSocket();
  
  const [x,y,z,d] = position.split(",").map(Number);
  const pillarMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/pillar-map.png");
  const waterMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/water-map1.png");
  const wallMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/wall-map.png");
  wallMap.wrapS = wallMap.wrapT = THREE.RepeatWrapping;
  
  // 2Dシェイプでアーチを定義
  const handRailShape = new THREE.Shape();
  handRailShape.moveTo(-width, 0);
  for (let i=-4; i<=4; i++) {
    // handRailShape.lineTo(width*i/4-.5, 4 + Math.cos(Math.PI*i/8) * 2)
    handRailShape.lineTo(width*i/4,    5 + Math.cos(Math.PI*i/8) * 2)
    // handRailShape.lineTo(width*i/4+.5, 4 + Math.cos(Math.PI*i/8) * 2)
  }
  handRailShape.lineTo(width, 0);
  for (let i=-4; i<4; i++) {
    handRailShape.lineTo(-width*i/4, Math.cos(Math.PI*i/8) * 2)
  }
  const step = 8;
  const floorShape = new THREE.Shape();
  floorShape.moveTo(-width, 0);
  for (let i=-step; i<=step; i++) {
      // floorShape.lineTo(width*i/step-0.1, 1.0 + Math.cos(Math.PI*i/(step*2)) * 2)
      floorShape.lineTo(width*i/step,     0.9 + Math.cos(Math.PI*i/(step*2)) * 2)
      // floorShape.lineTo(width*i/step+0.1, 1.0 + Math.cos(Math.PI*i/(step*2)) * 2)
  }
  floorShape.lineTo(width, 0);
  for (let i=-step; i<=step; i++) {
    floorShape.lineTo(-width*i/step, Math.cos(Math.PI*i/(step*2)) * 2)
  }

    // ------------------------------------------------------------
  // クリック時
  const handleClick = (e: any) => {
      e.stopPropagation();
      if (!playerInfo) return
      if (playerInfo.selectTarget !== "decoration") return

      const parent = e.parent;
      if (parent) { parent.remove(e); }
      send("selectBridge", {position})
  }
  // ------------------------------------------------------------ 
  return (
        <CommonMesh name="bridge" position={`${x},${y},${z}`} direction={direction} status={status}
          onClick={handleClick}
        meshList={[
          // 床
          {position: [0, 1.0, 0], geometry: new RoundedBoxGeometry(width / 2, 1, width / 2, 1, -0.2), materialParameters: {normalMap: waterMap}},
          {position: [0, 1.0, width*2], geometry: new RoundedBoxGeometry(width / 2, 1, width / 2, 1, -0.2), materialParameters: {normalMap: waterMap}},
          {position: [-width/4, .5, width], geometry: new THREE.ExtrudeGeometry(floorShape, { depth: width/2, bevelEnabled: false, UVGenerator: UVGenerator }), rotation: [0,Math.PI/2,0], materialParameters: {normalMap: pillarMap}},
          // 手摺
          {position: [3.5, 1, width], geometry: new THREE.ExtrudeGeometry(handRailShape, { depth: 1, bevelEnabled: false, UVGenerator: UVGenerator  }), rotation: [0,Math.PI/2,0], materialParameters: {normalMap: wallMap}},
          {position: [-4.5, 1, width], geometry: new THREE.ExtrudeGeometry(handRailShape, { depth: 1, bevelEnabled: false, UVGenerator: UVGenerator  }), rotation: [0,Math.PI/2,0], materialParameters: {normalMap: wallMap}},
          // 柱
          ...[[1,1],[1,-1],[-1,1],[-1,-1]].map(([dx,dz])=>({
            position: [dx*4, 3.0, width-width*dz] as [x: number, y: number, z: number],
            geometry: new THREE.BoxGeometry(1.2,4,1.2),
            materialParameters: {normalMap: wallMap},
          })),
          ...[[1,1],[1,-1],[-1,1],[-1,-1]].map(([dx,dz])=>({
            position: [dx*4, 2.5, width-width*dz] as [x: number, y: number, z: number],
            geometry: new THREE.BoxGeometry(1.5,2,1.5),
            materialParameters: {normalMap: wallMap},
          })),
          ...[[1,1],[1,-1],[-1,1],[-1,-1]].map(([dx,dz])=>({
            position: [dx*4, 1.8, width-(width+4)*dz] as [x: number, y: number, z: number],
            geometry: new RoundedBoxGeometry(1.5,1.5,1.5,1,1),
          })),
          ...[[1,1],[1,-1],[-1,1],[-1,-1]].map(([dx,dz])=>({
            position: [dx*4, 2.4, width-(width+4)*dz] as [x: number, y: number, z: number],
            geometry: new RoundedBoxGeometry(.7,.7,.7,1,1),
          })),
        ]}
    />
  )
}
const UVGenerator = {
  generateTopUV: (
    geometry: any,
    vertices: any,
    indexA: number,
    indexB: number,
    indexC: number
  ) => {
    // 上面・底面のUV
    const ax = vertices[indexA * 3];
    const ay = vertices[indexA * 3 + 1];
    const bx = vertices[indexB * 3];
    const by = vertices[indexB * 3 + 1];
    const cx = vertices[indexC * 3];
    const cy = vertices[indexC * 3 + 1];

    return [
      new THREE.Vector2(ax * 0.1, ay * 0.1),
      new THREE.Vector2(bx * 0.1, by * 0.1),
      new THREE.Vector2(cx * 0.1, cy * 0.1),
    ];
  },

  generateSideWallUV: (
    geometry: any,
    vertices: any,
    indexA: number,
    indexB: number,
    indexC: number,
    indexD: number
  ) => {
    // 側面のUV
    const ax = vertices[indexA * 3];
    const ay = vertices[indexA * 3 + 1];
    const az = vertices[indexA * 3 + 2];
    const bx = vertices[indexB * 3];
    const by = vertices[indexB * 3 + 1];
    const bz = vertices[indexB * 3 + 2];

    // XZ平面ベースで側面UVを計算
    const width = Math.sqrt((ax - bx) ** 2 + (az - bz) ** 2);
    const height = Math.abs(ay - by);

    return [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(width * 0.1, 0),
      new THREE.Vector2(width * 0.1, height * 0.1),
      new THREE.Vector2(0, height * 0.1),
    ];
  },
};