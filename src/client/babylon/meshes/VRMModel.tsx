import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { VRMAnimationLoaderPlugin, createVRMAnimationClip, } from "@pixiv/three-vrm-animation";

export const VRMModel = ({height}: {height: number}) => {
  const { scene } = useThree();
  const clock = useRef(new THREE.Clock());
  const mixer = useRef<THREE.AnimationMixer>(null);
  const vrmRef = useRef(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";

    // VRMプラグインを登録
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      "/vrm/nanoha.vrm",
      (gltf) => {
        const vrm = gltf.userData.vrm;
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        vrm.scene.scale.set(height, height, height);
        vrm.scene.rotation.y = Math.PI;
        // 回転軸を反転
        // const leg = vrm.humanoid.getNormalizedBoneNode('leftLowerLeg');
        // // if (leg) { leg.rotation.x *= -1; }
        vrm.scene.traverse((obj) => (obj.frustumCulled = false));

        scene.add(vrm.scene);
        vrmRef.current = vrm;

        // AnimationMixer作成
        mixer.current = new THREE.AnimationMixer(vrm.scene);

        const animLoader = new GLTFLoader();

        // VRMAアニメーション用プラグインを登録
        animLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));
        animLoader.load("/vrm/テトリス.vrma", (animGltf) => {
          const vrmAnimations = animGltf.userData.vrmAnimations;
          if (vrmAnimations && vrmAnimations.length > 0) {
            const clip = createVRMAnimationClip(vrmAnimations[0], vrm);
            console.log(clip)
            const action = mixer.current?.clipAction(clip);
            action?.play();
          } else {
            console.warn('no vrmAnimations found or vrm not loaded yet');
          }
        });
      },
      undefined,
      (error) => console.error(error)
    );
  }, [scene]);

  // フレームごとに更新
  useFrame(() => {
    const delta = clock.current.getDelta();
    if (vrmRef.current) {
      vrmRef.current.update(delta);
      if (mixer.current) mixer.current.update(delta);
    }
  });

  return null; // 自前でシーンにaddしてるので、R3F的には何も描かない
}
