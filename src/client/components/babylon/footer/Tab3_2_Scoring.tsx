
export const Tab3_2_Scoring = () => <>
    <p>ゲーム終了時に、自分のボードを上から見下ろして確認します。</p>
    <p>タイルや装飾要素が一部でも見えている場合、それぞれ勝利点（VP）を獲得します。</p>
    <p>ただし、<b>完全に隠れているタイルや装飾要素は勝利点を得られません。</b></p>
    <div className="remarks">
        <div className="remarks-score-row">
            <img className="remarks-score" src={`/images/babylon/score/score1.png`} />
            <div>
                <b>彫像が建っている階層 ✕ 1VP</b>。ただし、柱として使用されている彫像は 0VP です。<br/>
                例：1/2/3 階層目の彫像は 1/2/3 VP
            </div>
        </div>
        <div className="remarks-score-row">
            <img className="remarks-score" src={`/images/babylon/score/score2.png`} />
            <div>
                <b>噴水が建っている階層 ✕ 3VP</b><br/>
                例：1/2/3 階層目の噴水は 3/6/9 VP
            </div>
        </div>
        <div className="remarks-score-row">
            <img className="remarks-score" src={`/images/babylon/score/score3.png`} />
            <div>
                <b>橋が建っている階層 ✕ 3VP</b><br/>
                例：1/2/3 階層目の橋は 3/6/9 VP
            </div>
        </div>
        <div className="remarks-score-row">
            <img className="remarks-score" src={`/images/babylon/score/score4.png`} />
            <div>
                <b>階段が繋ぐ階層の合計 = VP</b><br/>
                例：1-2 階層目の階段は 3 VP。2-3 階層目の階段は 5 VP。3-4 階層目の階段は 7 VP。
            </div>
        </div>
        <div className="remarks-score-row">
            <img className="remarks-score" src={`/images/babylon/score/score5.png`} />
            <div>
                装飾の多様性（像 + 噴水 + 橋 + 階段）<br/>
                <b>4種類の装飾を1セットそろえるごとに 4VP</b>
            </div>
        </div>
        <div className="remarks-score-row">
            <img className="remarks-score" src={`/images/babylon/score/score6.png`} />
            <div>
                花<br/><b>4色の花タイルをそろえるごとに 4VP</b>
            </div>
        </div>
        <div className="remarks-score-row">
            <img className="remarks-score" src={`/images/babylon/score/score7.png`} />
            <div>
                展望台<br/><b>階層に関係なく 1VP</b><br/>
            </div>
        </div>
        <div className="remarks-score-row">
            <img className="remarks-score" src={`/images/babylon/score/score8.png`} />
            <div>
                最高地点： <b>最も高いテラスタイルの階層 ✕ 2VP</b><br/>
                例：1階 = 2VP、2階 = 4VP、3階 = 6VP<br/>
                （※庭は階層を1段ずつ積み上げるように建設しなければなりません。）
            </div>
        </div>
    </div>
    <hr className="overview"/>
    <span className="en">
        <p>At the end of the game, look at your board from above.</p>
        <p>Each tile or decorative element that is partially or completely visible earns victory points (VP).</p>
        <p>However, any tiles or decorative elements that are completely hidden do not earn VP.</p>
        <p>
            - Statues: each statue is worth 1 VP multiplied by the level on which it is built.<br/>
            For example, a statue built on the third level is worth 3 VP.<br/>
            A statue used as a pillar is hidden and is worth 0 VP.
        </p>
        <p>
        - Fountains: each fountain is worth 3 VP multiplied by the level on which it is built.<br/>
        For example, a fountain built on the second level is worth 6 VP.
        </p>
        <p> - Bridges: as with fountains, each bridge is worth 3 VP multiplied by the level on which it is built. </p>
        <p>
        - Stairways: each stairway is worth a total number of VP equal to the sum of the levels it connects.<br/>
        For example, a stairway between the first and second levels is worth 3 VP;<br/>
        a stairway between the second and third levels is worth 5 VP, etc.
        </p>
        <p> - Diversity of decorative items: each set of 4 different decorative items (1 statue + 1 fountain + 1 bridge + 1 stairway) is worth 4 VP. </p>
        <p> - Flowers: each set of 4 tiles with different colored flowers is worth 4 VP. </p>
        <p> - Belvederes: each Belvedere is worth 1 VP (regardless of the level). </p>
        <p> - Highest point: you receive VP equal to the double of the level with the highest Terrace tile (first level = 2 VP, second level = 4 VP, third level = 6 VP, etc.).<br/>
        Reminder: you must build your garden one level at a time.</p>
    </span>
</>