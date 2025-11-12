
export const Tab2_1_GameProgress = () => <>
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
    <hr className="overview"/>
    <span className="en">
        The game plays over a number of rounds depending on the number of players: <br/>
        15 rounds with 2 players, 13 rounds with 3 players, and 11 rounds with 4 players.<br/>
        Starting with the first player and moving clockwise, during their turn each player:<br/>
        A. must perform a digging action;<br/>
        B. may perform a building action;<br/>
        C. must store and/or discard any unused items.<br/>
    </span>
</>