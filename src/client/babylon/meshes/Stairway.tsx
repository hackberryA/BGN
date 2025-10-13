// Stair.tsx
import * as THREE from "three";
import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { componentType } from "./types";

type StairProps = { width?: number; height?: number; material?: THREE.Material; };

export function Stairway({ width, height, position, direction = 0 }: componentType) {
  const steps = 15;
  const stepWidth = (width * 0.75) / steps;
  const stepHeight = height / (steps - 1);
  const defaultMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffffaa }), []);

  // メッシュを配列化して描画
  const stepMeshes = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= steps; i++) {
      const w = width / 2;
      const h = stepHeight * i;
      const d = stepWidth;
      arr.push({
        key: i,
        args: [w, h, d] as [number, number, number],
        position: [0, (stepHeight / 2) * i, stepWidth * (i - 6)] as [number, number, number],
      });
    }
    return arr;
  }, [steps, width, height]);

  // 一番上の段
  const topStep = useMemo(
    () => ({
      args: [width / 2, stepHeight / 2, width * 0.8] as [number, number, number],
      position: [0, height * 1.05, width * 0.85] as [number, number, number],
    }),
    [width, height]
  );

  return (
    <group name="stairway" position={position} rotation={[0, Math.PI * direction / 2, 0]}>
      {stepMeshes.map((s) => (
        <mesh key={s.key} position={s.position}>
          <boxGeometry args={s.args} />
          <primitive object={defaultMaterial.clone()} />
        </mesh>
      ))}
      <mesh position={topStep.position}>
        <boxGeometry args={topStep.args} />
        <primitive object={defaultMaterial.clone()} />
      </mesh>
      {/* HitBox */}
      <mesh layers={1}>
        <boxGeometry args={[width, 2, width]} />
        <meshBasicMaterial color="red" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
