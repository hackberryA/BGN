import * as THREE from "three";
import React from "react";
import { useMemo } from "react";

export const PlayerBoard = ({ width }: {width: number}) => {
  // Geometry と Material は useMemo で一度だけ生成するのがベター
  const geometry = useMemo(() => new THREE.PlaneGeometry(width * 12, width * 12), [width]);
  const material = useMemo( () => new THREE.MeshStandardMaterial({ color: "#aafaff" }), [] );

  return (
    <>
    <gridHelper args={[width * 8, 8, "#eeeeee", "#eeeeee"]} />
    <mesh
      name="playerBoard"
      userData={{ component: "PLAYER_BOARD" }}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
      />
    </>
  );
};
export default PlayerBoard