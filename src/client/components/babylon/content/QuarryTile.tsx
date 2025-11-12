import { CSSProperties, useEffect } from "react";
import { FlowerType } from "../const/flowers";
import { LayerType } from "../const/layers";
import { SymbolType } from "../const/symbols";

type QuarryTileProps = {
    selected?: boolean;
    onClick?: () => void;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    layer: LayerType | FlowerType;
    flower: FlowerType;
    symbols: SymbolType[];
    isFlower?: boolean;
    style?: CSSProperties;
    disabled?: boolean
}
export const QuarryTile = (props: QuarryTileProps) => {
    const {selected, onClick, onMouseOver, onMouseOut, layer, flower, symbols, isFlower=false, style, disabled=false} = props
    return <div 
            className={`quarry-tile ${selected ? "selected" : ""}`} 
            onClick={disabled ? ()=>{} : onClick}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            style={{
                backgroundImage: `url(/images/babylon/textures/${isFlower ? flower : layer}.png)`,
                opacity: disabled ? .2 : 1,
                ...style,
            }}
        >
        <span className="edge-top" />
        <span className="edge-bottom" />
        <span className="edge-left" />
        <span className="edge-right" />
        <img className="flower" src={`/images/babylon/flowers/${flower}.png`} style={{scale: (isFlower?.5:1)}} />
        {symbols[0] !== "empty" && <img className="symbol symbol-1" src={`/images/babylon/symbols/${symbols[0]}.png`} />}
        {symbols[1] !== "empty" && <img className="symbol symbol-2" src={`/images/babylon/symbols/${symbols[1]}.png`} />}
        {symbols[2] !== "empty" && <img className="symbol symbol-3" src={`/images/babylon/symbols/${symbols[2]}.png`} />}
        {symbols[3] !== "empty" && <img className="symbol symbol-4" src={`/images/babylon/symbols/${symbols[3]}.png`} />}
    </div>
}