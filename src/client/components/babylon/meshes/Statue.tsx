import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'
import { ComponentType } from './types';
import { CommonMesh } from './CommonMesh';

export const Statue = ({position, direction, status}: ComponentType) => {
    const [x,y,z,d] = position.split(",").map(Number);
    const { scene } = useGLTF( "/vrm/nanoha1013.vrm" )

    const geometries = useMemo(() => {
        const geoList: THREE.BufferGeometry[] = []

        scene.traverse((obj: any) => {
        if (obj.isMesh && obj.geometry?.attributes?.position) {
            // ジオメトリを複製（共有を避ける）
            // const geo = obj.geometry.clone()
            const geo = new THREE.BufferGeometry()
            geo.copy(obj.geometry)
            if (geo) geoList.push(geo)
        }
        })

        return  geoList

    }, [scene])

    return  <CommonMesh name="statue" position={`${x},${y},${z}`} direction={direction} status={status}
        meshList={ geometries.map(v=> ({
            position: [0,0,0],
            geometry: v,
        }))}
        // onPointerOver={status === "preview" ? handlePointerOver : () => {}}
        // onPointerOut={status === "preview" ? handlePointerOut : () => {}}
    />
}
