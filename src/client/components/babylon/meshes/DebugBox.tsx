import { height, width } from "./common";
import * as THREE from "three";

type DebugBoxProps = {
  position: string;
  color?: string;
  opacity?: number;
  symbol?: string;
}
export function DebugBox({ position, color, opacity, symbol }: DebugBoxProps) {
  const [x,y,z] = position.split(",").map(Number);
  const textureLoader = new THREE.TextureLoader();
  const texture = symbol ? textureLoader.load(`/images/babylon/symbols/${symbol}.png`) : null;
  return (
    <group name="debugBox">
      <mesh position={[ width * (x - 3.5), height * y + 1 , width * (z - 3.5) ]}  >
        <boxGeometry args={[height - 4, .1, height - 4]} />
        <meshBasicMaterial color={color ?? "blue"} transparent opacity={opacity ?? .2} wireframe />
      </mesh>
      <mesh 
        position={[ width * (x - 3.5), height * y + 1.1 , width * (z - 3.5) ]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        geometry={new THREE.PlaneGeometry(symbol?8:2,symbol?8:2)}
        material={new THREE.MeshBasicMaterial({
          map: texture,
          color: color ?? "blue",
          transparent: true,
          opacity: .8,
          // depthWrite: false,
          // side: THREE.DoubleSide
        })}
      />
    </group>
  )
}
