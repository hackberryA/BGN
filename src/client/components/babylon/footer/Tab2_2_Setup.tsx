
export const Tab2_2_Setup = () => <>
    <p>以下はプレイ前の準備手順です。1～3は自動でセットアップされます。</p>
    <div className="remarks">
        1. 採石場、供給エリアをセット<br/>
        2. プレイヤーボードと開始テラスタイルを配布<br/>
        3. ラウンドトークンを準備<br/>
        4. 採石場をプレイヤー人数に合わせて調整
    </div>
    <hr className="overview"/>

    <p>1.まず、箱をテーブルの中央に置きます。箱の中央に「採石場」、周囲に「供給エリア」をセットします。</p>
    <div className="remarks">
        a. <b>「供給エリア」（サプライ）</b>には構成物（1本柱、2本柱、展望台、階段、噴水、彫像、橋）を配置します。<br/>
        b. <b>「採石場」</b>には48枚（16枚×3種）のテラスタイルを3層に分けて配置します。<br/>
        <span style={{marginLeft: "20px"}}>1. <b>玄武岩タイル</b>を採石場の一番下の層に並べます。</span><br/>
        <span style={{marginLeft: "20px"}}>2. 玄武岩タイルの上に<b>花崗岩タイル</b>を重ねます。</span><br/>
        <span style={{marginLeft: "20px"}}>3. 花崗岩タイルの上に<b>粘土タイル</b>を重ねます。</span><br/>
        <p><img src="/images/babylon/description/quarry.png" /></p>
    </div>

    <p>2. プレイヤーボードを1枚選び、自分の前に置きます。</p>
    <div className="remarks">
        <p>花の模様が対応する「開始テラスタイル」を取り、ボードの保管エリアのスロットに置きます。</p>
        <p><img src="/images/babylon/description/playerBoard.png" /></p>
    </div>

    <p>3. ラウンドトークンを準備します。</p>
    <div className="remarks">
        <p>ラウンドトークンを裏向きでよく混ぜ、プレイヤー人数に応じて以下の枚数をランダムに選びます。</p>
        <span style={{marginLeft: "20px"}}>- 2人プレイ：14枚</span><br/>
        <span style={{marginLeft: "20px"}}>- 3人プレイ：12枚</span><br/>
        <span style={{marginLeft: "20px"}}>- 4人プレイ：10枚</span><br/>
        <p>選んだトークンを公開せず、「ゲーム終了トークン」の上に積み重ねます。<br/>
        使わなかったラウンドトークンはゲームから取り除きます。<br/>
        最初のプレイヤーを任意に決め、そのプレイヤーの右隣にラウンドトークンの山を置きます。</p>
    </div>

    <p>4. 採石場をプレイヤー人数に合わせて調整します。</p>
    <div className="remarks">
        <p>3人プレイの場合： <b>採石場から粘土タイルを3枚取り除きます。</b>最初のプレイヤーから順に、各プレイヤーが任意のタイルを1枚ずつ取り除きます。</p>
        <p>2人プレイの場合： <b>採石場から粘土タイルを6枚取り除きます。</b>最初のプレイヤーから順に、各プレイヤーが任意のタイルを1枚ずつ取り除きます。</p>
    </div>
    <hr className="overview"/>
    <span className="en">
    <p>1. Place the box in the center of the table; this will form the supply and quarry.</p>
    <p>2. Lay out the single and double pillars in the supply, along with the belvederes, stairways, fountains, statues, and bridges.</p>
    <p>3. Set up the quarry by placing the 48 Terrace tiles – Material side up – in 3 different layers:</p>
    <p>• First, randomly spread the 16 Basalt tiles across the bottom of the quarry.<br/>
    • Then randomly spread the 16 Granite tiles on top of the Basalt tiles.<br/>
    • Finally, randomly spread the 16 Clay tiles on top of the Granite tiles.
    </p>
    <p>4. Choose a player board and place it in front of you.<br/>
    Then pick up the corresponding starting Terrace tile (matching flowers) and place it in the slot of your board’s storage area.</p>
    <p>5. Shuffle the Round tokens face down and select 14/12/10 at random, if playing with 2/3/4 players, respectively.<br/>
    Without revealing them, stack them on the Game End token. Remove any unused Round tokens from the game.<br/>
    Choose any player to go first and place the stack of Round tokens in front of the player to their right.</p>
    <p>6. Adjust the quarry to the number of players:</p>
    <p>
    • In a 3-player game, remove 3 Clay tiles from the quarry: 
        starting with the first player and moving clockwise, each player removes 1 tile of their choice.<br/>
    • In a 2-player game, remove 6 Clay tiles from the quarry: 
        starting with the first player, each player removes 1 tile of their choice. Repeat this step twice.
    </p>
    </span>
</>;

