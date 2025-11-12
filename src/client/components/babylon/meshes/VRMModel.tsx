import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { VRMAnimationLoaderPlugin, createVRMAnimationClip, } from "@pixiv/three-vrm-animation";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import PlayerBoardMesh from "./PlayerBoardMesh";


const width = 20;
const height = 16;

const VRMModelScene = ({vrma, setVRMA}: {vrma: string, setVRMA: any}) => {
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
      <mesh>
        {/* ボード */}
        <PlayerBoardMesh />
        {/* コンポーネント */}
        <VRMModel height={height * 3} vrma={vrma} setVRMA={setVRMA}/>
      </mesh>
  );
};

export const VRMModelCanvas = () => {
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(1)
  const [ambientLightColor, setAmbientLightColor] = useState("#ffffff")
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(1)
  const [directionalLightColor, setDirectionalLightColor] = useState("#ffffff")
  const vrmaList = [
    {filename: "VRMA_01", title: "ポーズ1"},
    {filename: "VRMA_02", title: "ポーズ2"},
    {filename: "VRMA_03", title: "ポーズ3"},
    {filename: "VRMA_04", title: "ポーズ4"},
    {filename: "VRMA_05", title: "ポーズ5"},
    {filename: "VRMA_06", title: "ポーズ6"},
    {filename: "VRMA_07", title: "ポーズ7"},
    {filename: "テトリス", title: "テトリス"},
    {filename: "愛包ダンスホール", title: "愛包ダンスホール"},
  ]
  const [vrma, setVRMA] = useState<string>("テトリス");
  const containerRef = useRef(null)
  return (<>
    <div style={{position: "relative", width: "100%"}}>
      <div id="loading-vrm" className="center" style={{fontSize: "20px", width:"100%", top: "200px", position: "absolute"}}>
        <span>Now Loading...</span>
      </div>
      <div
        id="vrm-canvas"
        ref={containerRef}
        style={{
          width: "100%",
          height: "780px",
          background: "#ffffff",
          position: "relative",
          zIndex: 0,
          opacity: 0.01
        }}
        className="row"
      >
        <div style={{position: "absolute", zIndex:10, backgroundColor: "#def0ff44", padding: "5px"}}>
          <div className="col s12">
            {vrmaList.map(({filename, title},index) => 
                <button 
                  key={index}
                  className="btn waves-effect waves-light btn-small light-blue darken-1"
                  style={{margin: "6px"}}
                  onClick={()=>setVRMA(filename)}
                >{title}</button>
            ) }
            {vrma && <span>Now Playing "{vrma}"</span>}
          </div>
          <div className="col s2">
            <p className="range-field m0">
              <input type="range" id="ambientLightIntensity" min="0" max="100" 
                onChange={(e)=>{setAmbientLightIntensity(Number(e.target.value) / 10)}} />
            </p>
            [ambientLight] {ambientLightIntensity}, {ambientLightColor}
          </div>
          <div className="col s1" style={{padding:"12px"}}>
            <input id="ambientLightColor" type="color"value={ambientLightColor}
                onChange={(e)=>{setAmbientLightColor(e.target.value)}} />
          </div>
          <div className="col s2">
            <p className="range-field m0">
              <input type="range" id="directionalLightIntensity" min="0" max="100" 
                onChange={(e)=>{setDirectionalLightIntensity(Number(e.target.value) / 10)}} />
            </p>
            [directionalLight] {directionalLightIntensity}, {directionalLightColor}
          </div>
          <div className="col s1" style={{padding:"12px"}}>
            <input id="directionalLightColor" type="color" value={directionalLightColor}
              onChange={(e)=>{setDirectionalLightColor(e.target.value)}} />
          </div>
        </div>
        <Canvas
          shadows
          camera={{ position: [0, 90, 150], fov: 45, near: 0.1, far: 10000 }}
        >
          <group>
            {/* シーン内ライト */}
            <ambientLight intensity={ambientLightIntensity} color={ambientLightColor} />
            <directionalLight position={[100, 200, 100]} color={directionalLightColor} intensity={directionalLightIntensity}  />
            <directionalLight position={[-100, 200, -100]} color={directionalLightColor} intensity={directionalLightIntensity}  />
            <VRMModelScene vrma={vrma} setVRMA={setVRMA}/>
          </group>
          <OrbitControls
            enablePan
            enableRotate
            enableZoom
            target={[0,60,0]}
            mouseButtons={{ LEFT: undefined, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }}
          />
        </Canvas>
      </div>
    </div>
    </>
  );
};

const VRMModel = ({height, vrma, setVRMA}: {height: number, vrma: string, setVRMA: any}) => {
  const { scene, invalidate } = useThree();
  const clock = useRef(new THREE.Clock());
  const mixer = useRef<THREE.AnimationMixer>(null);
  const vrmRef = useRef<any>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";

    // VRMプラグインを登録
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      "/vrm/nanoha1013.vrm",
      (gltf) => {
        const vrm = gltf.userData.vrm;
        scene.remove()
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        vrm.scene.scale.set(height, height, height);
        vrm.scene.rotation.y = Math.PI;
        // 回転軸を反転
        // const leg = vrm.humanoid.getNormalizedBoneNode('leftLowerLeg');
        // // if (leg) { leg.rotation.x *= -1; }
        vrm.scene.traverse((obj: any) => (obj.frustumCulled = false));

        scene.add(vrm.scene);
        vrmRef.current = vrm;

        // AnimationMixer作成
        mixer.current = new THREE.AnimationMixer(vrm.scene);
        setVRMA("愛包ダンスホール")
      },
      undefined,
      (error) => console.error(error)
    );
  }, [scene]);
  useEffect(() => {
    if (!vrmRef.current) return;

    function fadeObject(obj: any, targetOpacity: number, duration = 500) {
      obj.traverse((child: any) => {
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat: any) => {
            mat.transparent = true;
            const start = mat.opacity ?? 1;
            const startTime = performance.now();
            const animate = (time: number) => {
              const t = Math.min((time - startTime) / duration, 1);
              mat.opacity = start + (targetOpacity - start) * t;
              invalidate(); // ← これ重要（R3Fに再描画を指示）
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
        }
      });
    }
    const fadeOut = () => fadeObject(vrmRef.current.scene, 0, 500);
    const fadeIn = () => fadeObject(vrmRef.current.scene, 1, 500);

    // フェードアウト → 新しいVRMAロード
    fadeOut();
    setTimeout(() => {
      const loader = new GLTFLoader();
      loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
      loader.load(`/vrm/${vrma}.vrma`, (animGltf) => {
        const vrmAnimations = animGltf.userData.vrmAnimations;
        if (vrmAnimations?.length && vrmRef.current) {
          const clip = createVRMAnimationClip(vrmAnimations[0], vrmRef.current);
          if (clip && mixer.current) {
            mixer.current.stopAllAction();
            const action = mixer.current.clipAction(clip);
            action.reset();
            action.play();
          }
        } else {
          console.warn("no vrmAnimations found or vrm not loaded yet");
        }
      });
    }, 500);
    // 読み込み完了後フェードイン
    setTimeout(() => {
      fadeIn();
      if (vrma) {
        const e = document.getElementById("vrm-canvas");
        if (e) e.style.opacity = "1.0"
        const e1 = document.getElementById("loading-vrm");
        if (e1) e1.style.display = "none"
      }
    }, 500);
  }, [vrma]);

  // フレームごとに更新
  useFrame(() => {
    const delta = clock.current.getDelta();
    if (vrmRef.current) vrmRef.current.update(delta);
    if (mixer.current) mixer.current.update(delta);
  });

  return null; // 自前でシーンにaddしてるので、R3F的には何も描かない
}
