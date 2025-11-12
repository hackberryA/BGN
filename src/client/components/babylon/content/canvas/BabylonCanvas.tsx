import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import { Canvas, useThree } from "@react-three/fiber";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useStorage } from "../../../../hooks/useStorage";
import { PlayerBoardProps } from "../PlayerBoard";
import { BabylonCanvasScene } from "./BabylonCanvasScene";
import { DebugComponents } from "./DebugComponents";

type PlayerInfo = {playerId: string}

export const BabylonCanvas = ({playerId, props}: PlayerInfo & {props?: PlayerBoardProps}) => {
  const [cameraPosition, setCameraPosition] = useState<[x: number, y: number, z: number]>([-120, 150, 180])

  const containerRef = useRef(null)
  const [key, setKey] = useState(0);
  const [reloading, setReloading] = useState<boolean>(false);
  const {userId} = useStorage()
  const [debug, setDebug] = useState(false);
  const tooltipRef = useRef<HTMLAnchorElement>(null);
  // const scene = useVRMScene("/vrm/nanoha1013.vrm")
  useEffect(() => {
    if (tooltipRef.current) {
      // 初期化
      const instance = M.Tooltip.init(tooltipRef.current, {
        position: "right",
        exitDelay: 50,
        enterDelay: 50,
      });

      // クリーンアップ
      return () => {
        instance.destroy();
      };
    }
  }, [tooltipRef]);

  const reload = () => {
    // setKey((k) => k + 1)
    setReloading(true)
    // setCameraPosition([cameraPosition[0]+1,cameraPosition[1]+1,cameraPosition[2]+1])
  }

  return (
    <div id={`wrapper-canvas-${playerId}`} className="wrapper-canvas" ref={containerRef} >
      {/* リロード範囲 */}
      <div className="canvas-reset-button" onClick={reload}></div>
      {userId === playerId &&
        <div style={{position: "absolute", left: 0, bottom: "-30px", verticalAlign: "text-bottom" }}>
              <span className="switch">
                  <label>
                    <input type="checkbox" onChange={()=>setTimeout(()=>setDebug(!debug), 250)}/>
                    <span className="lever"></span>
                  </label>
                </span>
            <span style={{color: "skyblue"}}>
              設置可能箇所を表示
            </span>
        </div>
      }

      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 45, near: 0.1, far: 10000 }}
        onCreated={({ gl }) => { 
          gl.autoClear = false
        }}
        onLoadStart={()=>{console.log("canvas load start")}}
        key={`canvas-${playerId}-${key}`}
      >
          <CameraTracker 
            reloading={reloading}
            setCameraPosition={setCameraPosition}
            setKey={setKey}
            setReloading={setReloading}
          />
          <BabylonCanvasScene playerId={playerId} props={props} />
          <OrbitControls
            enablePan
            enableRotate
            enableZoom
            mouseButtons={{ LEFT: undefined, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }}
          />
          {debug && <DebugComponents playerId={playerId} />}
      </Canvas>
    </div>
  );
};

type CameraProps = {
  reloading: boolean;
  setReloading: Dispatch<SetStateAction<boolean>>;
  setCameraPosition: Dispatch<SetStateAction<[x: number, y: number, z: number]>>;
  setKey: Dispatch<SetStateAction<number>>;
}
function CameraTracker({ reloading, setCameraPosition, setKey, setReloading }: CameraProps) {
  // useThree はCanvas内でのみ使用可
  const { camera } = useThree();
  
  // reload ボタン押下時、擬似的に発火
  useEffect(() => {
    if (reloading) {
      setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
      setKey((k) => k + 1)
      setReloading(false)
    }
  }, [reloading]);

  return null;
}