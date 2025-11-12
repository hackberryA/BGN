/**
 * バビロン概要
 */
export const Tab2_3_Quarry = () => <>
<p>採石場（Quarry）から、<b>見えている</b>テラスタイルを1枚取ります。<br/>
ここで「見えている」とは、他のタイルに覆われていないタイルのことです。</p>

<p>その後、以下の条件1つにつき<b>一段柱1本</b>を受け取ります。</p>
<div className="remarks">
- 同じ階層以下のタイルと接している場合<br/>
- 採石場の外周の辺に接している場合<br/>
- 採石場の底に接している（タイルがない）場合<br/>
- 描かれている花の種類が、自分の花と一致している場合<br/>
</div>
<br/>
<p>例）以下の図で、赤の花のプレイヤーが【A】または【B】を取った場合</p>
<div className="remarks" style={{height: "267px"}}>
    <img src="/images/babylon/description/digging.png" style={{width: "230px", margin: "12px 20px", float: "left"}}/>
    <p>
        【パターンA】<br/>
        1. 下辺は同じ階層のため、<b>一段柱1本</b>を受け取ります。<br/>
        2. 上辺は下の階層のため、<b>一段柱1本</b>を受け取ります。<br/>
        3. 右辺は最下層のため、<b>一段柱1本</b>を受け取ります。<br/>
        x. 左辺は上の階層のため、適用外です。<br/>
        x. 花が異なるため、適用外です<br/>
    </p>
    <p>
        【パターンB】<br/>
        4. 上辺は壁のため、<b>一段柱1本</b>を受け取ります。<br/>
        5. 左辺は同じ階層のため、<b>一段柱1本</b>を受け取ります。<br/>
        6. 花が一致するため、<b>一段柱1本</b>を受け取ります。<br/>
        x. 右辺は上の階層のため、適用外です。<br/>
        x. 下辺は上の階層のため、適用外です。<br/>
    </p>
</div>

<hr className="overview"/>
<span className="en">
<p>Take a visible Terrace tile from the quarry.</p>
<p>A tile is deemed to be visible when it is not covered by another tile.</p>
<p>You immediately receive 1 single pillar:</p>
<p>
- for each tile edge bordering 1 visible tile on the same level or lower.<br/>
- for each tile edge bordering the edge of the quarry.<br/>
- for each tile edge bordering the bottom of the quarry.<br/>
- if the flower on the Terrace tile matches the one on your player board
</p>

<p>Example:</p>
<p>
    Linda (white flower ) takes Granite tile A, and immediately receives 3 single pillars: <br/>
    1 for the bordering Granite tile on the same level; <br/>
    1 for the bordering Basalt tile on the level below; <br/>
    1 for the bottom of the quarry. <br/>
    Linda receives no pillars for the bordering Clay tile since it is on a higher level. <br/>
</p>

<p>
John (pink flower ) takes Basalt tile B, and immediately receives 3 single pillars: <br/>
1 for the edge of the quarry; <br/>
1 for the Basalt tile on the same level; <br/>
1 because the tile John chose matches the flower type on his board. <br/>
John receives no pillars for the bordering Clay and Granite tiles since they are on higher levels. <br/>
</p>
</span>
</>;
