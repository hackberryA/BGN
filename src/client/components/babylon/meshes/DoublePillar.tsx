import { useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { height, width } from "./common";
import { CommonMesh } from "./CommonMesh";
import { ComponentType } from "./types";

export function DoublePillar({position, status }: ComponentType) {
  const [x,y,z] = position.split(",").map(Number);
  const {send, currentPlayerInfo: playerInfo} = useBabylonWebSocket()

  const normalMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/wall-map.png");

  // 柱身ジオメトリー
  const shaftGeometry1 = useMemo(() => {
    const g = new THREE.CylinderGeometry(4, 4, height+2, 100, 1, true);
    const posAttr = g.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);
      const angle = Math.atan2(vertex.z, vertex.x);
      const reduction = 0.3 * Math.sin(30 * angle);
      const r = Math.sqrt(vertex.x ** 2 + vertex.z ** 2);
      const newR = r - reduction;
      vertex.x = newR * Math.cos(angle);
      vertex.z = newR * Math.sin(angle);
      posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    posAttr.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);
  const shaftGeometry2 = useMemo(() => {
    const g = new THREE.CylinderGeometry(4, 4, height-4, 80, 1, true);
    const posAttr = g.attributes.position;
    const vertex = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      const shaftWidth = 3.5 - i % 2 / 3
      vertex.fromBufferAttribute(posAttr, i);
      if (Math.abs(vertex.x) > Math.abs(vertex.z)) {
        if (vertex.x > 0) {
          posAttr.setXYZ(i, shaftWidth, vertex.y, vertex.z);
        } else {
          posAttr.setXYZ(i, -shaftWidth, vertex.y, vertex.z);
        }
      } else {
        if (vertex.z > 0) {
          posAttr.setXYZ(i, vertex.x, vertex.y, shaftWidth);
        } else {
          posAttr.setXYZ(i, vertex.x, vertex.y, -shaftWidth);
        }
      }
    }
    posAttr.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  // クリック時
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!playerInfo) return
    if (playerInfo.selectTarget !== "pillar") return;
    const mesh = e.object;
    if (mesh.parent) {
      mesh.parent.remove(mesh);
    }
    send("selectPillar", {x,y,z})
  }

  return (<CommonMesh name={"doublePillar"} position={position} status={status}
    onClick={handleClick}
    meshList={[
      // 柱身
      {geometry: shaftGeometry1, position: [0, height/2+1, 0]},
      {geometry: shaftGeometry2, materialParameters: {normalMap}, position: [0, height*3/2, 0]},
      // 柱頭
      {geometry: new RoundedBoxGeometry(width / 2+1, 1.5, width / 2, 1, -0.2), materialParameters: {normalMap}, position: [0, height * 2 - 1.5, 0]},
      // 柱中
      {geometry: new RoundedBoxGeometry(width / 2.2, 1, width / 2.2, 1, -0.2), materialParameters: {normalMap}, position: [0, height + 2, 0]},
      {geometry: new THREE.CylinderGeometry(5, 5, 1.4, 20, 1, false), materialParameters: {normalMap}, position: [0, height+.6, 0]},
      // 柱基
      {geometry: new RoundedBoxGeometry(width / 2, 2, width / 2, 1, -0.2), materialParameters: {normalMap}, position: [0, 2, 0]},
      {geometry: new THREE.CylinderGeometry(4.5, 4.5, 1.8, 20, 1, false), materialParameters: {normalMap}, position: [0, 3.6, 0]},
      // 横柱・下
      {geometry: new THREE.CylinderGeometry(.6, .6, 7, 20, 1, false), materialParameters: {normalMap}, position: [0, height+3,  4], rotation: [0,0,Math.PI/2]},
      {geometry: new THREE.CylinderGeometry(.6, .6, 7, 20, 1, false), materialParameters: {normalMap}, position: [0, height+3, -4], rotation: [0,0,Math.PI/2]},
      {geometry: new THREE.CylinderGeometry(.6, .6, 7, 20, 1, false), materialParameters: {normalMap}, position: [4, height+3, 0], rotation: [Math.PI/2,0,0]},
      {geometry: new THREE.CylinderGeometry(.6, .6, 7, 20, 1, false), materialParameters: {normalMap}, position: [-4, height+3, 0], rotation: [Math.PI/2,0,0]},
      // 横柱・上
      {geometry: new THREE.CylinderGeometry(.6, .6, 7, 20, 1, false), materialParameters: {normalMap}, position: [0,  height*2-2.5,  4], rotation: [0,0,Math.PI/2]},
      {geometry: new THREE.CylinderGeometry(.6, .6, 7, 20, 1, false), materialParameters: {normalMap}, position: [0,  height*2-2.5, -4], rotation: [0,0,Math.PI/2]},
      {geometry: new THREE.CylinderGeometry(.6, .6, 7, 20, 1, false), materialParameters: {normalMap}, position: [4,  height*2-2.5, 0], rotation: [Math.PI/2,0,0]},
      {geometry: new THREE.CylinderGeometry(.6, .6, 7, 20, 1, false), materialParameters: {normalMap}, position: [-4, height*2-2.5, 0], rotation: [Math.PI/2,0,0]},
    ]}
  />)
}
