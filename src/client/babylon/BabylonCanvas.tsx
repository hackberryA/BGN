import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { JSX, useEffect, useRef } from "react";
import * as THREE from "three";
import { DoublePillar } from "./meshes/DoublePillar";
import PlayerBoard from "./meshes/PlayerBoard";
import { SinglePillar } from "./meshes/SinglePillar";
import { Stairway } from "./meshes/Stairway";
import { useRoomData } from "./hooks/useRoomData";

const width = 20;
const height = 16;
const data = new Map()

type PlayerInfo = {playerId: string}
const Components = ({playerId}: PlayerInfo) => {
  const roomData = useRoomData();
  const playerData = roomData.getPlayerInfo(playerId)

  for (var x=0; x<8; x++) {
    for (var z=0; z<8; z++) {
      data.set(`${x},0,${z}`, {position: {x:x, y:0, z:z}, type: "single-pillar", direction: 0})
    }
  }
  const list: JSX.Element[] = [];
  data.forEach(({position, type, direction}, key) => {
        const x = width * (position.x - 3.5);
        const y = height * position.y + 1;
        const z = width * (position.z - 3.5);
        switch (type) {
          case "single-pillar": list.push(<SinglePillar width={width} height={height} position={[x,y,z]}/>);break;
          case "double-pillar": list.push(<DoublePillar width={width} height={height} position={[x,y,z]}/>);break;
          case "stairway": list.push(<Stairway width={width} height={height} position={[x,y,z]} direction={direction}/>);break;
        }
  })
  return list
}

const Scene = ({playerId}: PlayerInfo) => {
  const { gl, camera, raycaster } = useThree();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    camera.layers.enable(0)
    camera.layers.enable(1)
    raycaster.layers.enable(1); // クリック対象を Layer 1 のみに限定
    raycaster.layers.disable(0); // UI層など、反応させたくない層は無効
  }, [gl, camera, raycaster]);

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
      <mesh 
        // onClick={(e) => console.log("Clicked mesh", e.object.parent?.name)} 
        // onPointerOver={(e) => console.log("Over mesh", e.object.parent?.name)}
        // onPointerLeave={(e) => console.log("Leave mesh", e.object.parent?.name)}
        >
        {/* ボード */}
        <PlayerBoard width={width} />
        {/* コンポーネント */}
        <Components playerId={playerId}/>
        {/* <ClickableBoard /> */}
      </mesh>
    </group>
  );
};

export const BabylonCanvas = ({playerId}: PlayerInfo) => {
  const containerRef = useRef(null)
  return (
    <div
      id={`wrapper-canvas-${playerId}`}
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
        <Scene playerId={playerId} />
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
