import React, { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import PlayerBoard from "./meshes/PlayerBoard";
import { SinglePillar } from "./meshes/SinglePillar";
import { DoublePillar } from "./meshes/DoublePillar";
import { Stairway } from "./meshes/Stairway";

const width = 20;
const height = 16;

const Components = () => {
  const data = [
    {position: {x:5, y:0, z:5}, type: "single-pillar"},
    {position: {x:7, y:0, z:7}, type: "double-pillar"},
    {position: {x:7, y:0, z:5}, type: "stairway"},
    {position: {x:7, y:0, z:0}, type: "stairway", direction: 0},
    {position: {x:7, y:0, z:1}, type: "stairway", direction: 1},
    {position: {x:7, y:0, z:2}, type: "stairway", direction: 2},
    {position: {x:7, y:0, z:3}, type: "stairway", direction: 3},
  ]
  return data.map(
    ({position, type, direction}) => {
      const x = width * (position.x - 3.5);
      const y = height * position.y + 1;
      const z = width * (position.z - 3.5);
      switch (type) {
        case "single-pillar": return <SinglePillar width={width} height={height} position={[x,y,z]}/>
        case "double-pillar": return <DoublePillar width={width} height={height} position={[x,y,z]}/>
        case "stairway": return <Stairway width={width} height={height} position={[x,y,z]} direction={direction}/>
      }
      return <></>
    }
  )    
}

const Scene = () => {
  const { gl, camera, size } = useThree();
  const containerRef = useRef<HTMLDivElement>(null);

  // 出力カラースペースとアンチエイリアス設定
  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.setPixelRatio(window.devicePixelRatio);

    // 中クリック無効
    gl.domElement.addEventListener("mousedown", (e) => {
      if (e.button === 1) e.preventDefault();
    });

    // リサイズ処理
    const resizeRenderer = () => {
      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      gl.setSize(width, height, false);
      // camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resizeRenderer);
    resizeRenderer();

    return () => {
      window.removeEventListener("resize", resizeRenderer);
    };
  }, [gl, camera]);
  return (
    <group>
      {/* シーン内ライト */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 20, 10]} intensity={2} castShadow />
      <mesh>
        {/* ボード */}
        <PlayerBoard width={width} />
        {/* コンポーネント */}
        <Components/>
      </mesh>
    </group>
  );
};

export const BabylonCanvas = () => {
  const containerRef = useRef(null)
  return (
    <div
      id="wrapper-canvas"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#eeeeee",
        position: "relative",
        zIndex: 0,
      }}
    >
      <Canvas
        shadows
        camera={{ position: [200, 100, 100], fov: 45, near: 0.1, far: 10000 }}
      >
        <Scene />
        <OrbitControls
          enablePan
          enableRotate
          enableZoom
          mouseButtons={{ LEFT: undefined, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }}
        />
      </Canvas>
    </div>
  );
};
