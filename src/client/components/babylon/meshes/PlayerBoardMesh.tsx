import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { width } from './common';
import { commonShadow, defaultMaterialParameters } from '../const/mesh';

export const PlayerBoardMesh = ({displayGrid}: {displayGrid?: boolean}) => {
  // テクスチャの繰り返し設定など
  const texture = useLoader(THREE.TextureLoader, "/images/babylon/textures/playerBoard.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1); // 繰り返し回数（必要に応じて変更）

  // Geometry と Material は useMemo で一度だけ生成するのがベター
  const geometry = useMemo(() => new THREE.BoxGeometry(width * 9.1, width * 8.5, 2), [width]);
  // const geometry = useMemo(() => new RoundedBoxGeometry(width * 2.1, width * 2.1, 4, 4, width * 0.15), [width]);
  const material = useMemo( () => new THREE.MeshStandardMaterial({ map: texture, color: "#ffffff", roughness:.3, metalness:.1, }), [] );
  
  // タイルストレージを削る
  const cut = useMemo(() => new RoundedBoxGeometry(width * 2.1, width * 2.1, 4, 4, width * 0.15), [width]);
  const cutMesh = new THREE.Mesh(cut);
  cutMesh.position.set(width * 5, width * 2.5, 0); // どこを削るか調整
  cutMesh.updateMatrix();
  const baseMesh = new THREE.Mesh(geometry);
  const subtracted = CSG.subtract(baseMesh, cutMesh);
  const CellsMap = []
  for (let x=0;x<8;x++) {
    for (let z=0;z<8;z++) {
      CellsMap.push(<mesh key={`cell-${x}-${z}`} {...commonShadow}  layers={1} 
        geometry={new THREE.BoxGeometry(width/2,0,width/2)}
        material={new THREE.MeshStandardMaterial({ color: 0xbdbdbd, transparent: true, opacity: .9,  })} 
        position={[ width * (x - 3.5), 1 , width * (z - 3.5) ]}/>)
    }
  }

  return (
    <>
    <mesh
      {...commonShadow}
      name="playerBoard"
      userData={{ component: "PLAYER_BOARD" }}
      geometry={subtracted.geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[width * 0.4, -0.1, 0]}
      />
      {CellsMap}
      <gridHelper args={[width * 8, 8, "#eeeeee", "#eeeeee"]} position={[0, 1, 0]}/>
    </>
  );
};


export default PlayerBoardMesh