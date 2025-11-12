import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket";
import { TerraceTileInfo } from "../../../types/BabylonTypes";
import { commonShadow } from "../const/mesh";
import { PlayerBoardProps } from "../content/PlayerBoard";
import { height, width } from "./common";
import { ComponentType } from "./types";

const OPACITY_STORAGE = 0.3;
const OPACITY_PREVIEW = 0.0;
const OPACITY_HOVER = 0.8;

type TerraceTileProps = {
  tileInfo: TerraceTileInfo;
  props?: PlayerBoardProps;
}
export function TerraceTile({ position, status, tileInfo, props }: ComponentType & TerraceTileProps) {
  const {tileNo, flower, layer, symbols, display, rotate} = tileInfo;
  // const {selected, setSelected} = props;
  const [x,y,z] = position.split(",").map(Number);
  const pos: [x:number,y:number,z:number] = [ width * (x - 3), height * y, width * (z - 3) ]
  const {send, data, isBuildingPhase} = useBabylonWebSocket();
  const playerId = data.playerIds[data.playerIndex];
  const playerInfo = data.playerInfoMap[playerId];
  const groupRef = useRef<any>(null!);
  const selectedMap = playerInfo ? Object.values(playerInfo.selectedTileMap).map(v=>v.tileNo) : []
  

  // テクスチャ設定
  const [gardenSide, materialSide, flowerTex, symbol1, symbol2, symbol3, symbol4, tileMap] = useLoader(THREE.ImageLoader, [
      `/images/babylon/textures/${flower}.png`,
      `/images/babylon/textures/${layer==="starting"?`${layer}-${flower}`:layer}.png`,
      `/images/babylon/flowers/${flower}.png`,
      `/images/babylon/symbols/${symbols[0]}.png`,
      `/images/babylon/symbols/${symbols[1]}.png`,
      `/images/babylon/symbols/${symbols[2]}.png`,
      `/images/babylon/symbols/${symbols[3]}.png`,
      "/images/babylon/textures/tileMap.png",
  ]);

  const texture1 = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ベース画像のサイズを基準に
    canvas.width = gardenSide.width;
    canvas.height = gardenSide.height;

    // 1/4
    const w = canvas.width / 2;
    // シンボルのサイズ
    const s = w * .4

    // シンボルを描画（それぞれの中心で回転）
    function drawRotated(img: HTMLImageElement, x: number, y: number, size: number, rot: number) {
      if (!ctx) return
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2); // 中心に移動
      ctx.rotate(rotate * Math.PI / 2); // 角度（radian）
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
    // ベースを描画
    drawRotated(gardenSide, 0, 0, canvas.width, rotate);

    // シンボルを2x2に配置（透過部分はそのまま反映される）
    drawRotated(symbol1, (w-s)*.5, (w-s)*.5, s, rotate); // 左上
    drawRotated(symbol2, w+(w-s)*.5, (w-s)*.5, s, rotate); // 右上
    drawRotated(symbol3, w+(w-s)*.5, w+(w-s)*.5, s, rotate); // 左下
    drawRotated(symbol4, (w-s)*.5, w+(w-s)*.5, s, rotate); // 右下
    drawRotated(flowerTex, w-s*.5, w-s*.5, s, rotate)
    drawRotated(tileMap, 0, 0, canvas.width, rotate)

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, [gardenSide, materialSide, flowerTex, symbol1, symbol2, symbol3, symbol4]);

  // 裏側
  const texture2 = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ベース画像のサイズを基準に
    canvas.width = materialSide.width;
    canvas.height = materialSide.height;

    // 1/4
    const w = canvas.width / 2;
    // シンボルのサイズ
    const s = w * .4

    // シンボルを描画（それぞれの中心で回転）
    function drawRotated(img: HTMLImageElement, x: number, y: number, size: number, rot: number) {
      if (!ctx) return
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2); // 中心に移動
      ctx.rotate(rotate * Math.PI / 2); // 角度（radian）
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
    // ベースを描画
    drawRotated(materialSide, 0, 0, canvas.width, rotate);

    // シンボルを2x2に配置（透過部分はそのまま反映される）
    if (layer !== "starting") {
      drawRotated(symbol1, (w-s)*.5, (w-s)*.5, s, rotate); // 左上
      drawRotated(symbol2, w+(w-s)*.5, (w-s)*.5, s, rotate); // 右上
      drawRotated(symbol3, w+(w-s)*.5, w+(w-s)*.5, s, rotate); // 左下
      drawRotated(symbol4, (w-s)*.5, w+(w-s)*.5, s, rotate); // 右下
      drawRotated(flowerTex, w-s*.5, w-s*.5, s, rotate)
    }
    drawRotated(tileMap, 0, 0, canvas.width, rotate)

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, [gardenSide, materialSide, flowerTex, symbol1, symbol2, symbol3, symbol4]);

  const textureSide = useLoader(THREE.TextureLoader, "/images/babylon/textures/tileMapSide.png");
  // タイルストレージを削る
  // ベース
  const geometry = useMemo(() => new THREE.BoxGeometry(width * 1.95, 1, width * 1.95) , [width]);
  // マテリアル
  const materials = useMemo(() => {
    const opacity = 1;
    const visible = (status !== "preview");
    const commonParams = {roughness:.3, metalness:.1, transparent: true, opacity, visible}
    // 側面
    const colorSide = new THREE.MeshStandardMaterial({ 
      map: textureSide,
      color: "#cccccc",
      ...commonParams,
    });
    return [
      colorSide, // +X
      colorSide, // -X
      new THREE.MeshStandardMaterial({ map: texture1, color: "#ffffff", ...commonParams }),    // +Y（上面）
      new THREE.MeshStandardMaterial({ map: texture2, color: "#ffffff", ...commonParams }),    // -Y（下面）
      colorSide, // +Z
      colorSide, // -Z
    ];
  }, [texture1]);

  useEffect(()=>{ 
    materials.forEach(v=>{
      v.transparent = true;
      switch (status) {
        case "preview": v.opacity  = OPACITY_PREVIEW; break;
        case "storage-0":
          if (props && props?.selected === 0 || selectedMap.includes(tileNo)) {
            v.opacity = OPACITY_STORAGE
          } else {
            v.opacity = 1
          }
          break;
        case "storage-1":
          if (props && props?.selected === 1 || selectedMap.includes(tileNo)) {
            v.opacity = OPACITY_STORAGE
          } else {
            v.opacity = 1
          }
          break;
        default: 
          v.opacity = 1
      }
    })
  }, [status, props])

  // ------------------------------------------------------------
  // クリック
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!isBuildingPhase) return
    if (playerInfo.selectTarget !== "tile") return  
    switch (status) {
      // ストレージ1
      case "storage-0":
        if (props && !selectedMap.includes(tileNo)) {
          props.setSelected(props.selected === 0 ? -1 : 0);
        }
        return
      // ストレージ2
      case "storage-1":
        if (props && !selectedMap.includes(tileNo)) {
          props.setSelected(props.selected === 1 ? -1 : 1);
        }
        return
      // プレビューをクリック
      case "preview":
        if (props) {
          props?.setSelected(-1)
          send("selectTile", {x, y, z, tileInfo})
        }
        return
      // 選択中を回転
      case "selected":
        // if (playerInfo.storageTiles[0]?.tileNo === tileNo) props?.setSelected(0)
        // if (playerInfo.storageTiles[1]?.tileNo === tileNo) props?.setSelected(1)
        send("rotateTile", {x, y, z, tileInfo})
        return
    }
  }
  // ------------------------------------------------------------
  // プレビュー
  const handlePointerOver = (e:any) => {
    e.stopPropagation();
    if (status === "confirmed") {
      setHover(true);
    }
    if (playerInfo?.selectTarget !== "tile") return;
    if (status === "preview") {
      materials.forEach(v=>{ 
        v.transparent = true;
        v.visible = true;
        v.opacity = OPACITY_HOVER;
      })
    } else if (status === "selected") {
      // materials.forEach(v=>{ 
      //   v.opacity = OPACITY_HOVER
      // })
    }
  };
  const handlePointerOut = (e:any) => {
    if (status === "confirmed") {
      setHover(false);
    }
    if (playerInfo?.selectTarget !== "tile") return;
    if (status === "preview") {
      materials.forEach(v=>{
        v.transparent = true;
        v.visible = false;
        v.opacity = OPACITY_PREVIEW;
      })
    } else if (status === "selected") {
      // materials.forEach(v=>{ 
      //   v.opacity = 1
      // })
    }
  };
  const [hover, setHover] = useState(false)
  
  // ------------------------------------------------------------
  return (<>
      <mesh ref={groupRef}
        {...commonShadow}
        material={materials}
        geometry={geometry}
        position={pos}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        layers={1}
        // rotation={[.1,0,-.1]}
      />
      {/* アウトライン */}
      <mesh key={`outline-terraceTile-${position}-${status}`}
          scale={status === "selected" ? 1.035 : 1.02} position={pos}
          geometry={geometry}
          material={new THREE.MeshBasicMaterial({
              color: status === "selected" ? 0xff0000 : hover ? 0x00ff00 : 0x137400, // 輪郭の色
              transparent: true,
              side: THREE.BackSide,  // 背面だけ描く
              opacity: status === "preview" ? (hover ? 1 : .7) : 1,
              visible: status !== "preview" || status === "preview" && hover,
          })}
      />
    </>
  );
}
