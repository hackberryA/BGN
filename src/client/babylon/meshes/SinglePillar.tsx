import { useMemo, useRef } from "react";
import { EventHandlers, InstanceProps, MathProps, ReactProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { componentType } from "./types";
import { Mutable, Overwrite } from "@react-three/fiber/dist/declarations/src/core/utils";

export function SinglePillar({ width, height, position }: componentType) {
  const groupRef = useRef<any>(null!);
    
  const handleClick = () => {
    if (groupRef.current.userData.status == "isPreview") {
      groupRef.current.userData.status = "isSelected"
      groupRef.current.traverse((obj: any) => {
        if (!obj.isMesh) return;
        if (obj.name !== "hitBox") {
          obj.material.opacity = 1;
        }
      });
    } else if (groupRef.current.userData.status == "isSelected") {
      groupRef.current.userData.status = "isPreview"
    }
  }
  const handlePointerOver = () => {
    groupRef.current.traverse((obj: any) => {
      if (!obj.isMesh) return
      if (groupRef.current.userData.status !== "isPreview") return
      obj.material.transparent = true;
      if (obj.name !== "hitBox") {
        obj.material.opacity = 0.5;
      } else {
        obj.material.opacity = 0.1;
      }
    });
  };

  const handlePointerOut = () => {
    groupRef.current.traverse((obj: any) => {
      if (!obj.isMesh) return
      if (groupRef.current.userData.status !== "isPreview") return
      obj.material.opacity = 0.0;
    });
  };
  
  const defaultMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xffffaa,
    transparent: true,
    opacity: 0,
  }), []);

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
    <group ref={groupRef}
      name="singlePillar"
      position={position}
      userData={{status: "isPreview"}}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      >
        <mesh 
            name="singlePillar1" 
            geometry={shaftGeometry}
            material={defaultMaterial}
            position={[0, height / 2, 0]}
        />
        <mesh 
            name="singlePillar2" 
            geometry={new RoundedBoxGeometry(width / 2, 2, width / 2, 1, -0.2)}
            material={defaultMaterial}
            position={[0, height - 2, 0]}
        />
        <mesh 
            name="singlePillar3" 
            geometry={new RoundedBoxGeometry(width / 2, 2, width / 2, 1, -0.2)}
            material={defaultMaterial}
            position={[0, 2, 0]}
        />
        {/* HitBox */}
        <mesh name="hitBox" layers={1} >
            <boxGeometry args={[width, 0, width]} />
            <meshBasicMaterial color="red" transparent opacity={0} />
        </mesh>
    </group>
  );
}
