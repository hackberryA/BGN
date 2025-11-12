import { ThreeEvent } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { commonShadow } from '../const/mesh';
import { height, width } from './common';



export type CommonMeshProps = {
    name: string;
    position: string;
    direction?: number | undefined; // y軸90度回転数
    status?: string;
    onClick?: (event: ThreeEvent<MouseEvent>) => void;
    // onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
    // onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
    meshList?: {
        geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap> | Readonly<THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap> | undefined>,
        position: [x: number, y: number, z: number];
        materialParameters?: THREE.MeshStandardMaterialParameters;
        rotation?: [x: number, y: number, z: number];
    }[];
    statue?: any
}
export const CommonMesh = (props: CommonMeshProps) => {
    const [hover, setHover] = useState(false)

    // 引数
    const {name, position, direction=0, meshList=[], status="confirmed", onClick, statue=<></> } = props
    // 座標
    const [x,y,z] = position.split(",").map(Number);
    const pos: [x:number, y:number, z:number] = [ width * (x - 3.5), height * y , width * (z - 3.5) ]
    // ref
    const groupRef = useRef<any>(null!);
    const onPointerOver = (e: any)=>{ 
        e.stopPropagation();
        setHover(true);
    }
    const onPointerOut = ()=>{ setHover(false); }
    return <group ref={groupRef} name={name} position={pos} rotation={[0, Math.PI / 2 * direction, 0]} >
        {meshList.map(({geometry, position, materialParameters, rotation}, index) => <mesh
            layers={0}
            key={`${name}-${position}-${status}-${index}`}
            {...commonShadow}
            position={position}
            geometry={geometry}
            material={new THREE.MeshStandardMaterial({
                // ...defaultMaterialParameters,
                color: 0xffffaa,
                roughness:.3,
                metalness:.1,
                flatShading: true,
                normalScale: new THREE.Vector2(2, 2),
                ...materialParameters,
                transparent: true,
                opacity: status === "preview" ? 0.7 : 1,
                visible: status !== "preview" || status === "preview" && hover,
            })}
            rotation={rotation}
        />)}
        {/* 彫像 */}
        {(status !== "preview" || status === "preview" && hover) && statue}
        {/* アウトライン */}
        {status === "confirmed" &&
            <group scale={1.02} onPointerOut={onPointerOut} onPointerOver={onPointerOver} >
                {meshList.map(({ geometry, position, rotation }, index) => (
                    <mesh key={`outline-${name}-${position}-${status}-${index}`}
                        layers={1}
                        position={position}
                        geometry={geometry}
                        material={new THREE.MeshBasicMaterial({
                            color: hover ? 0x00ff00 : 0xffffaa, // 輪郭の色
                            transparent: true,
                            opacity: hover ? 1 : .7,
                            side: THREE.BackSide,  // 背面だけ描く
                        })}
                        rotation={rotation}
                    />
                ))}
            </group>
        }
        {/* 当たり判定
            確定時：なし
            プレビュー：非表示
            ホバー、選択時：表示
        */}
        {status !== "confirmed" && (
            <group onClick={onClick} onPointerOut={onPointerOut} onPointerOver={onPointerOver}>
                <mesh name="hitBox" layers={1} position={[0,2,0]}  >
                    <boxGeometry args={[width, 0, width]} />
                    <meshBasicMaterial
                        color="red" 
                        transparent 
                        opacity={status==="selected" ? 0.3 : hover ? 0.15 : 0}
                        visible={status !== "preview" || status === "preview" && hover}
                        wireframe
                    />
                </mesh>
                {(name === "fountain" || name === "bridge") && (
                    <mesh name="hitBox" layers={1} position={[0,2,width]}  >
                        <boxGeometry args={[width, 0, width]} />
                        <meshBasicMaterial
                            color="orange" 
                            transparent 
                            opacity={status==="selected" ? 0.3 : hover ? 0.15 : 0}
                            visible={status !== "preview" || status === "preview" && hover}
                            wireframe
                        />
                    </mesh>
                )}
                {name === "bridge" && (
                    <mesh name="hitBox" layers={1} position={[0,2,width*2]}  >
                        <boxGeometry args={[width, 0, width]} />
                        <meshBasicMaterial
                            color="orange" 
                            transparent 
                            opacity={status==="selected" ? 0.3 : hover ? 0.15 : 0}
                            visible={status !== "preview" || status === "preview" && hover}
                            wireframe
                        />
                    </mesh>
                )}
                {name === "stairway" && (<>
                        <mesh name="hitBox" layers={1} position={[0,2+height,width]}  >
                            <boxGeometry args={[width, 0, width]} />
                            <meshBasicMaterial
                                color="orange" 
                                transparent 
                                opacity={status==="selected" ? 0.3 : hover ? 0.15 : 0}
                                visible={status !== "preview" || status === "preview" && hover}
                                wireframe
                            />
                        </mesh>
                        {/* 縦判定 */}
                        <mesh name="hitBox" layers={1} position={[0,2+height/2,width/2]}  >
                            <boxGeometry args={[width, height, 0]} />
                            <meshBasicMaterial
                                color="orange" 
                                transparent 
                                opacity={status==="selected" ? 0.3 : hover ? 0.15 : 0}
                                visible={status !== "preview" || status === "preview" && hover}
                                wireframe
                            />
                        </mesh>
                    </>
                )}
            </group>
        )}
    </group>
}