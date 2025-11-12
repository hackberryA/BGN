import Tabs from "../../materialize/Tabs";
import { VRMModelCanvas } from "../meshes/VRMModel";
import { Tab1_1_BabylonOverview } from "./Tab1_1_BabylonOverview";
import { Tab1_2_ComponentsView } from "./Tab1_2_ComponentsView";
import { Tab1_3_TerraceTilesDescription } from "./Tab1_3_TerraceTilesDescription";
import { Tab1_4_PlayerBoardsDescription } from "./Tab1_4_PlayerBoardsDescription";
import { Tab1_5_DesignersView } from "./Tab1_5_DesignersView";
import { Tab2_1_GameProgress } from "./Tab2_1_GameProgress";
import { Tab2_2_Setup } from "./Tab2_2_Setup";
import { Tab2_3_Quarry } from "./Tab2_3_Quarry";
import { Tab2_4_Building } from "./Tab2_4_Building";
import { Tab2_5_Decoration } from "./Tab2_5_Decoration";
import { Tab3_1_EndOfTheGame } from "./Tab3_1_EndOfTheGame";
import { Tab3_2_Scoring } from "./Tab3_2_Scoring";
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
                                { col:2, title: {ja: "バビロン", en: "Babylon"}, content: <Tab1_1_BabylonOverview/>},
                                { col:2, title: {ja: "コンポーネント", en: "Components"}, content: <Tab1_2_ComponentsView/>},
                                { col:2, title: {ja: "テラスタイル", en: "Terrace Tiles"}, content: <Tab1_3_TerraceTilesDescription/>},
                                { col:2, title: {ja: "プレイヤーボード", en: "Player Boards"}, content: <Tab1_4_PlayerBoardsDescription/>},
                                { col:2, title: {ja: "ゲームデザイン", en: "Game Design"}, content: <Tab1_5_DesignersView/>},
                                { col:1, title: {ja: "", en: ""}, content: <VRMModelCanvas/>},
                            ]} />
                        },
                        { 
                            col:4, title: {ja: "プレイ方法", en: "How To Play"}, hasTab: true,
                            content: <Tabs id="tab2" list={[
                                { col:2, title: {ja: "大まかな流れ", en: "Game Progress"}, content: <Tab2_1_GameProgress />},
                                { col:2, title: {ja: "0. 準備", en: "Setup"}, content: <Tab2_2_Setup />},
                                { col:2, title: {ja: "1. 採掘", en: "Quarry"}, content: <Tab2_3_Quarry />},
                                { col:2, title: {ja: "2. 柱＆タイル", en: "Pillars & Terrace Tile"}, content: <Tab2_4_Building />},
                                { col:2, title: {ja: "3. 装飾", en: "Decoative Items"}, content: <Tab2_5_Decoration />},
                                { col:2, title: {ja: "ラウンドトークン", en: "Round Token"}, content: <></>},
                            ]} />
                        },
                        { 
                            col:4, title: {ja: "ゲーム終了", en: "End Of The Game"}, hasTab: true,
                            content: <Tabs id="tab3" list={[
                                { col:6, title: {ja: "終了条件", en: "Final Scoring"}, content: <Tab3_1_EndOfTheGame/>},
                                { col:6, title: {ja: "得点計算", en: "Scoring"}, content: <Tab3_2_Scoring />},
                            ]} />
                        },
                    ]} />
                </div>
            </div>
        </footer>
    )
}
export default Footer;
