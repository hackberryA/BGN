import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { componentType } from "./types";

export function SinglePillar({ width, height, position }: componentType) {
  const defaultMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffffaa }), []);

  const shaftGeometry = useMemo(() => {
    const g = new THREE.CylinderGeometry(4, 4, 14, 100, 1, true);
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

  return (
    <group name="singlePillar" position={position}>
        <mesh 
            geometry={shaftGeometry}
            material={defaultMaterial}
            position={[0, height / 2, 0]}
        />
        <mesh 
            geometry={new RoundedBoxGeometry(width / 2, 2, width / 2, 1, -0.2)}
            material={defaultMaterial}
            position={[0, height - 2, 0]}
        />
        <mesh 
            geometry={new RoundedBoxGeometry(width / 2, 2, width / 2, 1, -0.2)}
            material={defaultMaterial}
            position={[0, 2, 0]}
        />
        {/* HitBox */}
        <mesh>
            <boxGeometry args={[width, 2, width]} />
            <meshBasicMaterial color="red" transparent opacity={0.1} />
        </mesh>
    </group>
  );
}
