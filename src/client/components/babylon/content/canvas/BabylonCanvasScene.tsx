import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { randInt } from "../../../../utils/CommonUtils";
import PlayerBoardMesh from "../../meshes/PlayerBoardMesh";
import { dayLength, skycolors } from "../../meshes/common";
import { PlayerBoardProps } from "../PlayerBoard";
import { PreviewComponents } from "../PreviewComponents";
import { BabylonCanvasComponents } from "./BabylonCanvasComponents";

type PlayerInfo = {playerId: string}
export const BabylonCanvasScene = ({playerId, props}: PlayerInfo & {props?: PlayerBoardProps}) => {
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
      const canvas = gl.domElement;
      if (!container || !canvas) return;
      canvas.style.opacity = "0";
      const width = container.clientWidth;
      const height = container.clientHeight;

      gl.setSize(width, height, false);
      // camera.aspect = width / height;
      camera.updateProjectionMatrix();
      canvas.style.opacity = "1";
    };

    window.addEventListener("resize", resizeRenderer);
    resizeRenderer();

    return () => { window.removeEventListener("resize", resizeRenderer); };
  }, [gl, camera]);

  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const bgRef = useRef<THREE.ShaderMaterial>(null!)
  const radius = 100; // 太陽の軌道半径
  const height = 60;  // 太陽の高さスケール

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() / dayLength) * Math.PI * 2; // 0→2πで一日
    const x = Math.cos(t) * radius;
    const y = Math.sin(t) * height; // 高さがsinで変わる（昼が高い）
    const z = -Math.cos(t) * radius / 2;

    // sin値から「昼〜夜」フェーズを算出（-1〜1）
    const phase = Math.sin(t);

    // 🌞 光の色と強さ
    let color = new THREE.Color()
    let intensity = 1.0

    if (phase > 0.6) {
      color.copy(skycolors.noon)
      intensity = 1.3
    } else if (phase > 0) {
      color = skycolors.morning.clone().lerp(skycolors.noon, phase / 0.6)
      intensity = 0.8 + 0.5 * (phase / 0.6)
    } else if (phase > -0.6) {
      color = skycolors.evening.clone().lerp(skycolors.night, (-phase) / 0.6)
      intensity = 0.8 - 0.7 * (-phase / 0.6)
    } else {
      color.copy(skycolors.night)
      intensity = 0.1
    }

    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();
      lightRef.current.color.copy(color);
      lightRef.current.intensity = intensity * 3;
    }
    // if (bgRef.current) {
    //   const skyTop = skycolors.evening.clone().lerp(skycolors.night, (1 - phase) / 2)
    //   const skyBottom = new THREE.Color("#ffffff").lerp(new THREE.Color("#111122"),  (1 - phase) / 2)
    //   bgRef.current.uniforms.bottomColor.value.copy(skyTop)
    //   bgRef.current.uniforms.bottomColor.value.copy(skyBottom)
    //   bgRef.current.uniformsNeedUpdate = true;
    // }
  });

  return (
    <group>
        <mesh scale={[1000, 1000, 1000]}>
          <sphereGeometry args={[1, 64, 64]} key={`sky-${randInt(100)}`} />
          <shaderMaterial
            ref={bgRef}
            side={THREE.BackSide}
            uniforms={{
              topColor: { value: new THREE.Color("#87ceeb") },
              bottomColor: { value: new THREE.Color("#ffffff") },
            }}
            uniformsNeedUpdate={true}
            vertexShader={`
              varying vec3 vPos;
              void main() {
                vPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 topColor;
              uniform vec3 bottomColor;
              varying vec3 vPos;
              void main() {
                float h = normalize(vPos).y * 0.5 + 0.5;
                gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0);
              }
            `}
          />
        </mesh>
      {/* シーン内ライト */}
      <ambientLight intensity={1} color={"#ffffff"} />
      <directionalLight position={[100, 200, 100]} intensity={.1}  />
      <directionalLight position={[-100, 100, -100]} intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}/>
      <directionalLight position={[100, 500, -100]} intensity={.1} />
      <directionalLight position={[height, height/2, height]} intensity={2} color={"#ff8181"} 
        ref={lightRef}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
      />
      <mesh>
        {/* ボード */}
        <PlayerBoardMesh />
        {/* コンポーネント */}
        {playerId === "preview"
          ? <PreviewComponents />
          : <BabylonCanvasComponents playerId={playerId} props={props}/>
        }
        {/* <ClickableBoard /> */}
      </mesh>
    </group>
  );
};
