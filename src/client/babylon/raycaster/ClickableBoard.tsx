import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const ClickableBoard = () => {
  const { camera, scene, mouse } = useThree();
  const raycaster = new THREE.Raycaster();
  
  const handleClick = (event: MouseEvent) => {
    // CanvasのDOM上の座標を正規化
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      console.log("Hit:", intersects[0].object.name);
    }
  };

  return <mesh onClick={(e) => console.log("Clicked mesh", e.object.name)} />
}


const defaultVector2 = () => new THREE.Vector2