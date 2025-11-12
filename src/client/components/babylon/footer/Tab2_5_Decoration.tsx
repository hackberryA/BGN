export const Tab2_5_Decoration = () => <>
<p>
タイルを配置したあと、装飾（階段、噴水、橋、彫像）を建設できるかどうかを確認します。<br/>
<b>ラウンド中に配置したタイル</b>の上に乗るように置く必要があります。<br/>
装飾物をサプライから取るのは無料です。<br/>
</p>
<p> 装飾物は、対応するシンボルが描かれた空きマスにのみ配置でき、タイルに対して斜め方向に配置することはできません。 </p>

<p>各装飾物には、配置時の固有ルールがあります。</p>

<div className="remarks" style={{height: "635px"}}>
    <p>・階段： <b>高さが1段違いで隣接した階段シンボル</b>が描かれた2つのタイルの間をつなぐように配置します。</p>
    <img src="/images/babylon/description/stairwayRule.png" style={{width: "500px", margin: "12px 20px"}}/>
    <p>・噴水： <b>同じ高さで隣接した噴水シンボル</b>が描かれた2つのタイルの間をつなぐように配置します。</p>
    <img src="/images/babylon/description/fountainRule.png" style={{width: "500px", margin: "12px 20px"}}/>
    <p>・橋： <b>同じ高さで1マス空間を挟んだ橋シンボル</b>が描かれた2つのタイルの間をつなぐように配置します。</p>
    <img src="/images/babylon/description/bridgeRule.png" style={{width: "500px", margin: "12px 20px"}}/>
    <p>・彫像： 任意の彫像シンボルの上に置けますが、2つ目以降は<b>既存の彫像と同じ行か列</b>にある必要があります。</p>
    <img src="/images/babylon/description/statueRule.png" style={{width: "230px", margin: "12px 20px", float: "left"}}/>
    <p>【例】</p>
    <p>
    - 1. 最初の彫像は、どの彫像シンボルの上にも配置できます。<br/>
    - 2. 2つ目の彫像は、1つ目と一直線上に置かなければなりません。<br/>
    - 3. 空きマスが既存の彫像と直線上にないため、彫像を置くことはできません。<br/>
    - 4. 空きマスは既存の彫像と直線上にあるため、彫像を置くことができます。<br/>
    </p>
    <p>【補足】</p>
    <p>- 彫像は、その後のターンでテラスタイルを支える柱として使用することができます。以降、彫像としては扱われません。</p>
</div>


<hr className="overview"/>
<span className="en">
<p>
After placing a tile, check if you can build 1 or more decorative items (stairway, fountain, bridge, or statue).<br/>
Taking a decorative item from the supply is free.<br/>
These items must always be placed, either entirely or partially, on at least 1 tile placed during this round.<br/>
Decorative items must be placed on empty spaces with the corresponding symbols, and never diagonally to the tiles.<br/>
</p>
<p>
Each item has its own rules when being placed:
</p>
<p>
Stairway: a stairway must connect 2 stairway symbols situated directly adjacent to each other on 2 tiles separated by 1 level.<br/>
Fountain: a fountain must connect 2 fountain symbols situated directly adjacent to each other on 2 tiles on the same level.<br/>
Bridge: a bridge must connect 2 bridge symbols directly opposite each other on 2 tiles on the same level separated by an empty space.<br/>
Statue: you can place your first statue on any statue symbol.<br/>
Thereafter, each statue must be in a straight line with a previously placed statue, regardless of the distance and levels between them.<br/>
</p>
<p> Reminder: A statue can then be used as a pillar to support a subsequent Terrace tile, after which it is no longer considered a statue. </p>
<p> Example: </p>
<p>
1. The first statue can be placed on any statue symbol.<br/>
2. The second statue is placed in a straight line with the first.<br/>
3. The third available space is not aligned with another statue, so you cannot place a statue there.<br/>
4. A third statue may be placed here because the space is aligned with another statue.<br/>
Although the space on the previous tile is now aligned with a statue,<br/>
you can no longer put a statue there as the tile was placed during a previous round.<br/>
</p>
</span>
</>