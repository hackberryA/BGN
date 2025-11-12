
// コンポーネント
const components = [
    {col: 2, image: "playerBoard",   name: "プレイヤーボード", amount: "4枚", scale: "100%"},
    {col: 2, image: "startingTiles", name: "開始テラスタイル", amount: "4枚", scale: "100%"},
    {col: 2, image: "TerraceTiles",  name: "テラスタイル",     amount: "48枚", scale: "100%"},
    {col: 2, image: "roundToken",    name: "ラウンドトークン", amount: "14枚", scale: "50%"},
    {col: 2, image: "GameEndToken",  name: "終了トークン",     amount: "1枚", scale: "70%"},
    {col: 2, image: "ScorePad",      name: "スコアパッド",     amount: "1枚", scale: "100%"},
    {col: 3, image: "quarry",        name: "採石場",          amount: "1個", scale: "100%"},
    {col: 3, image: "singlePillar",  name: "シングル柱",      amount: "148個", scale: "70%"},
    {col: 3, image: "doublePillar",  name: "ダブル柱",        amount: "60個", scale: "70%"},
    {col: 3, image: "belvederes",    name: "展望台",          amount: "38個", scale: "70%"},
    {col: 3, image: "stairway",      name: "階段",            amount: "38個", scale: "70%"},
    {col: 3, image: "fountain",      name: "噴水",            amount: "15個", scale: "70%"},
    {col: 3, image: "statue",        name: "彫像",            amount: "38個", scale: "70%"},
    {col: 3, image: "bridge",        name: "橋",              amount: "15個", scale: "70%"},
]
export const Tab1_2_ComponentsView = () => <>
    <div className="row m0">
        {components.map(({col, image, name, amount, scale}, index) => 
            <div className={`col s${col} card z-depth-0`} key={`tab1-2-${index}`}>
                <div className="card-image"><img src={`/images/babylon/description/${image}.png`} style={{scale: scale}}/></div>
                <div className="card-content" style={{whiteSpace: "nowrap"}}><p>{name}</p><p>{amount}</p></div>
            </div>
        )}
    </div>
</>