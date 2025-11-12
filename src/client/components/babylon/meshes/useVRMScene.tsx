// useVRMScene.ts
import { useEffect, useState } from "react";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";


export const useVRMScene = (url: string) => {
    const [scene, setScene] = useState<THREE.Group | null>();
    useEffect(() => {
        if (scene) return; // 既に読み込まれていれば再利用

        const loader = new GLTFLoader();
        loader.crossOrigin = "anonymous";
        loader.register((parser) => new VRMLoaderPlugin(parser));

        loader.load(
            url,
            (gltf) => {
                const vrm: VRM = gltf.userData.vrm;
                if (!vrm) return;

                VRMUtils.removeUnnecessaryJoints(vrm.scene);

                // 腕を下げる
                const left = vrm.humanoid?.getNormalizedBoneNode("leftUpperArm");
                const right = vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");
                if (left) left.rotation.z = THREE.MathUtils.degToRad(70);
                if (right) right.rotation.z = THREE.MathUtils.degToRad(-70);
                vrm.update(0);
                // vrm.humanoid = null;

                vrm.scene.traverse((obj: any) => {
                if (obj.isMesh) {
                    obj.material = new THREE.MeshStandardMaterial({
                    color: 0xffffaf,
                    roughness: 0.3,
                    metalness: 0.1,
                    });
                }
                });

                setScene(vrm.scene);
            },
            undefined,
            (error) => console.error("VRM load error:", error)
        );
    }, [url]);

    return scene;
};
