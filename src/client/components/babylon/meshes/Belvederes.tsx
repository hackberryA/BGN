import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { CommonMesh } from './CommonMesh';
import { ComponentType } from './types';

export const Belvederes = ({ position, direction=0 }: ComponentType) => {
    // 柱geometry
    const pillarPlateGeometry = useMemo(()=> new RoundedBoxGeometry(2.5, .5, 2.5, 1, -.1), [])

    // 柱身geometry
    const shaftGeometry = useMemo(() => {
        const g = new THREE.CylinderGeometry(1, 1, 5, 100, 1, true);
        const posAttr = g.attributes.position;
        const vertex = new THREE.Vector3();
        for (let i = 0; i < posAttr.count; i++) {
            vertex.fromBufferAttribute(posAttr, i);
            const angle = Math.atan2(vertex.z, vertex.x);
            const reduction = 0.05 * Math.sin(16 * angle);
            const r = Math.sqrt(vertex.x ** 2 + vertex.z ** 2);
            const newR = r - reduction;
            vertex.x = newR * Math.cos(angle);
            vertex.z = newR * Math.sin(angle);
            posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        posAttr.needsUpdate = true;
        g.computeVertexNormals();
        return g;
    }, []);

    // Normal Map
    const wallMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/wall-map.png");
    const waterMap = useLoader(THREE.TextureLoader, "/images/babylon/textures/water-map1.png");

    return (
        <CommonMesh name="Belvederes" position={position} direction={direction}
            meshList={[
                // 床
                {position: [0.0, 1.0, 0.0], geometry: new RoundedBoxGeometry(10, 1, 10, 1, -0.1), materialParameters: {normalMap: waterMap} },
                {position: [0.5, 1.3, 0.5], geometry: new THREE.BoxGeometry(8, 1, 8), materialParameters: {normalMap: waterMap} },
                {position: [1.0, 1.6, 1.0], geometry: new THREE.BoxGeometry(6, 1, 6), materialParameters: {normalMap: waterMap} },
                {position: [1.5, 1.9, 1.5], geometry: new THREE.BoxGeometry(4, 1, 4), materialParameters: {normalMap: waterMap} },
                // 壁
                {position: [3.0, 3.0, 0.0], geometry: new RoundedBoxGeometry(1, 1, 5.71, 1, -.1) },
                {position: [0.0, 2.5, 3.0], geometry: new RoundedBoxGeometry(5.71, 1, 1, 1, -.1) },
                {position: [-1.0, 3.0, 3.0], geometry: new RoundedBoxGeometry(2, 2, 1, 1, -.1) },
                // 柱1
                {position: [3.0, 4.5, -3.0], geometry: shaftGeometry, materialParameters: {normalMap: wallMap} },
                {position: [3.0, 1.8, -3.0], geometry: pillarPlateGeometry, materialParameters: {normalMap: wallMap} },
                {position: [3.0, 7.0, -3.0], geometry: pillarPlateGeometry, materialParameters: {normalMap: wallMap} },
                // 柱2
                {position: [3.0, 3.8, 3.0], geometry: shaftGeometry, materialParameters: {normalMap: wallMap} },
                {position: [3.0, 1.8, 3.0], geometry: pillarPlateGeometry, materialParameters: {normalMap: wallMap} },
                {position: [3.0, 6.3, 3.0], geometry: pillarPlateGeometry, materialParameters: {normalMap: wallMap} },
                // 柱3
                {position: [-3.0, 3.0, 3.0], geometry: shaftGeometry, materialParameters: {normalMap: wallMap} },
                {position: [-3.0, 1.8, 3.0], geometry: pillarPlateGeometry, materialParameters: {normalMap: wallMap} },
                {position: [-3.0, 5.5, 3.0], geometry: pillarPlateGeometry, materialParameters: {normalMap: wallMap} },
            ]}
        />
    );
}
