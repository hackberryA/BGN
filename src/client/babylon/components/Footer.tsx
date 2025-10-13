import Tabs from "../../components/materialize/Tabs";
import TabsTab from "../../components/materialize/Tabs";
import { VRMModelCanvas } from "../meshes/VRMModel";
// import rule from '../config/rule.yml';
// console.log("rule", rule)
const Footer = () => {
    return (
        <footer className="page-footer" style={{backgroundColor: "#f1fbff", paddingBottom: "1px"}}>
            <div className="container" style={{width: "95%"}}>
                <div className="row">
                    <Tabs id="tab0" list={[
                        { 
                            col:4, title: {ja: "ゲーム概要", en: "Summary"}, hasTab: true,
                            content: <Tabs id="tab1" list={[
                                { col:1},
                                { col:2, title: {ja: "バビロン", en: "Babylon"}, content: <BabylonOverview/>},
                                { col:2, title: {ja: "コンポーネント", en: "Components"}, content: <ComponentsView/>},
                                { col:2, title: {ja: "テラスタイル", en: "Terrace Tiles"}, content: <TerraceTilesDescription/>},
                                { col:2, title: {ja: "プレイヤーボード", en: "Player Boards"}, content: <PlayerBoardsDescription/>},
                                { col:2, title: {ja: "ゲームデザイン", en: "Game Design"}, content: <DesignersView/>},
                                { col:1, title: {ja: "", en: ""}, content: <VRMModelCanvas/>},
                            ]} />
                        },
                        { 
                            col:4, title: {ja: "プレイ方法", en: "How To Play"}, hasTab: true,
                            content: <Tabs id="tab2" list={[
                                { col:2, title: {ja: "大まかな流れ", en: "Game Progress"}, content: <GameProgress />},
                                { col:2, title: {ja: "0. 準備", en: "Setup"}, content: <></>},
                                { col:2, title: {ja: "1. 採掘", en: "Quarry"}, content: <></>},
                                { col:2, title: {ja: "2. 柱＆タイル", en: "Pillars & Terrace Tile"}, content: <></>},
                                { col:2, title: {ja: "3. 装飾", en: "Decoative Items"}, content: <></>},
                                { col:2, title: {ja: "ラウンドトークン", en: "Round Token"}, content: <></>},
                            ]} />
                        },
                        { 
                            col:4, title: {ja: "ゲーム終了", en: "End Of The Game"}, hasTab: true,
                            content: <Tabs id="tab3" list={[
                                { col:2, title: {ja: "3-1", en: "Babylon"}, content: <></>},
                                { col:2, title: {ja: "3-2", en: "Babylon"}, content: <></>},
                                { col:2, title: {ja: "3-3", en: "Babylon"}, content: <></>},
                            ]} />
                        },
                    ]} />
                </div>
            </div>
        </footer>
    )
}
export default Footer;

//////////////////////////////////////////////////
//  Tab1
//////////////////////////////////////////////////
// バビロン概要
const BabylonOverview = () => <>
    <p>紀元前6世紀、バビロンの王ネブカドネザル2世は、若き妻メディアのアミュティスを称えるために、無数の美しく香り高い花々に満ちた壮麗な庭園を作ろうとしました。</p>
    <p>彼は王国で最も名高い建築家たちを呼び集め、その才覚を試しつつ、自らの夢 ──後に「世界の七不思議」のひとつとして語り継がれる庭園を築くという壮大な構想── を実現させようとしたのです。</p>
    <br/>
    <p>『バビロン』では、あなたは熟練した建築家としての役割を担います。</p>
    <p>採石場を掘り進め、最高の素材を見つけ出し、それらを巧みに使って自らの庭園を築き上げましょう。</p>
    <p>ゲームの終盤、王の前で最も見事な設計を披露した者こそが勝者とされ、「王国一の建築家」の称号を与えられるのです。</p>
    <image  />
    <img src="/images/sample.png" width="400px" style={{marginLeft: "10px"}}/>
    <hr/>
    <span className="en">
        <p>In the 6th century BC, Nebuchadnezzar II, king of Babylon, wanted to honor his young wife, Amytis of Media, with magnificent gardens featuring countless beautifully scented flowers.</p>
        <p>So, he called on the most respected architects in his kingdom to test their ingenuity and fulfill his vision of creating one of the Seven Wonders of the Ancient World.</p>
        <br/>
        <p>In Babylon, you take on the role of a skilled architect.</p>
        <p>Excavate the quarry for the best materials and use them wisely to build your gardens.</p>
        <p>At the end of the game, the player who unveils the most impressive design before the king will be declared the winner and crowned the Greatest Architect in the Kingdom.</p>
    </span>
</>;

// コンポーネント
const components = [
    {col: 2, image: "playerBoard.png",   name: "プレイヤーボード", amount: "4枚", scale: "100%"},
    {col: 2, image: "startingTiles.png", name: "開始テラスタイル", amount: "4枚", scale: "100%"},
    {col: 2, image: "TerraceTiles.png",  name: "テラスタイル",     amount: "48枚", scale: "100%"},
    {col: 2, image: "roundToken.png",    name: "ラウンドトークン", amount: "14枚", scale: "50%"},
    {col: 2, image: "GameEndToken.png",  name: "終了トークン",     amount: "1枚", scale: "70%"},
    {col: 2, image: "ScorePad.png",      name: "スコアパッド",     amount: "1枚", scale: "100%"},
    {col: 3, image: "quarry.png",        name: "採掘場",          amount: "1個", scale: "100%"},
    {col: 3, image: "singlePillar.png",  name: "シングル柱",      amount: "148個", scale: "70%"},
    {col: 3, image: "doublePillar.png",  name: "ダブル柱",        amount: "60個", scale: "70%"},
    {col: 3, image: "belvederes.png",    name: "展望台",          amount: "38個", scale: "70%"},
    {col: 3, image: "stairway.png",      name: "階段",            amount: "38個", scale: "70%"},
    {col: 3, image: "fountain.png",      name: "噴水",            amount: "15個", scale: "70%"},
    {col: 3, image: "statue.png",        name: "彫像",            amount: "38個", scale: "70%"},
    {col: 3, image: "bridge.png",        name: "橋",              amount: "15個", scale: "70%"},
]
const ComponentsView = () => <>
    <div className="row m0">
        {components.map(({col, image, name, amount, scale}, index) => 
            <div className={`col s${col} card z-depth-0`} key={index}>
                <div className="card-image"><img src={`images/${image}`} style={{scale: scale}}/></div>
                <div className="card-content" style={{whiteSpace: "nowrap"}}><p>{name}</p><p>{amount}</p></div>
            </div>
        )}
    </div>
</>
// テラスタイル
const TerraceTilesDescription = () => <>
    <p>各テラスタイルには、<b>「素材面」</b>と<b>「庭園面」</b>の2つの面があります。</p>
    <p>テラスタイルには、<b>「建築シンボル」</b>と<b>（プレイヤー毎の）「花」</b>という、2種類の情報が描かれています。</p>
    <p>タイルの両面には、同じシンボルと同じ花が描かれています。</p>
    <p>なお、最初に配られる4枚のテラスタイルには「素材面」はなく、それぞれのプレイヤーの花の種類のみが描かれています。</p>
    <img src="images/TerraceTileSide.png"/>
    <p>素材面には、<b>「粘土」</b>、<b>「花崗岩」</b>、<b>「玄武岩」</b>の3種類があります。</p>
    <p>粘土タイルにはシンボルが2つ、花崗岩タイルには3つ、玄武岩タイルには4つ描かれています。</p>
    <img src="images/TerraceTileTypes.png"/>
    <p>庭園面は4種類あり、それぞれが4人のプレイヤーボードに対応しています。</p>
    <img src="images/TerraceTileGardenSide.png"/>
    <hr/>
    <span className="en">
        <p>Each Terrace tile has a Material side and a Garden side.</p>
        <p>Terrace tiles contain 2 pieces of information: building symbols and flowers that match the different player boards.</p>
        <p>Both sides of a tile show the same symbols and the same flower.</p>
        <p>The 4 starting Terrace tiles do not have a Material side; they show the player’s flower type instead.</p>
        <br/>
        <p>There are 3 types of Material side:Clay, Granite, and Basalt.</p>
        <p>Clay tiles have 2 symbols, Granite tiles 3, and Basalt tiles 4.</p>
        <br/>
        <p>There are 4 Garden sides, corresponding to the 4 player boards</p>
    </span>
</>

// プレイヤーボード
const PlayerBoardsDescription = () => <>
    <p>プレイヤーボードは、次の2つのエリアに分かれています。</p>
    <p>・<b>建築エリア</b>：柱を安定して立てられるよう、8×8のくぼみがあります。ここに柱を立てて、自分の庭園を築いていきます。</p>
    <p>・<b>保管エリア</b>：柱を1本ずつ保管できるスペースが6つと、テラスタイルを1枚保管できるスロットがあります。</p>
    <img src="images/playerBoards.png" style={{scale: "80%"}}/>
    <hr/>
    <span className="en">
        Player boards are divided into 2 areas:<br/>
        ‐ The building area has 64 notches in which to place pillars, so they remain stable and upright. This is where you build your garden.<br/>
        ‐ The storage area has 6 spaces for storing single pillars, and a slot for storing a Terrace tile for later use.<br/>
    </span>
</>
// デザイン
const DesignersView = () => <>
    <p>当サイトの説明や画像は <a href="https://gamers-hq.de/media/pdf/8f/91/24/Babylon_-_rules_EN_LIGHT.pdf" target="_blank">https://gamers-hq.de/media/pdf/8f/91/24/Babylon_-_rules_EN_LIGHT.pdf</a> から引用しています。</p>
    <p>サイト内のUI設計、3D設計等は「七花なのは」が行っていますが、本来の『バビロン』を参考にしています。</p>
    <br/>
    <p>本来の『バビロン』のゲームデザインに関わっている方々は以下です。</p>
    <hr/>
    <span className="en">
        <p>Designer: Olivier Grégoire</p>
        <p>Illustrator: The Creation Studio</p>
        <p>3D modeler: Matthias Klein</p>
        <p>Graphic designer: Fabrice Beghin</p>
        <br/>
    </span>
</>

const GameProgress = () => <>
    <p>ゲームはプレイヤー人数に応じて、以下のラウンド数で進行します：</p>
    <div className="remarks">
        2人プレイ： 15ラウンド<br/>
        3人プレイ： 13ラウンド<br/>
        4人プレイ： 11ラウンド<br/>
    </div>
    <p>スタートプレイヤーから順に時計回りで手番を行います。</p>
    <p>各プレイヤーの手番では、次の手順で行動します：</p>
    <div className="remarks">
        A. <b>掘削アクション</b>を必ず行う。<br/>
        B. <b>建設アクション</b>を任意で行うことができる。<br/>
        C. 未使用のアイテムを保管または破棄しなければならない。<br/>
    </div>
    <hr/>
    <span className="en">
        The game plays over a number of rounds depending on the number of players: <br/>
        15 rounds with 2 players, 13 rounds with 3 players, and 11 rounds with 4 players.<br/>
        Starting with the first player and moving clockwise, during their turn each player:<br/>
        A. must perform a digging action;<br/>
        B. may perform a building action;<br/>
        C. must store and/or discard any unused items.<br/>
    </span>
</>