
export const Tab2_4_Building = () => <>
<p>掘削後、あなたは<b> 柱 </b>および<b> テラスタイルを0～2枚 </b>配置できます。</p>
<div className="remarks">
    - テラスタイルを置くためには、柱（または彫像）が3～4本必要です。<br/>
    - 獲得したテラスタイル または ストレージエリアにあるテラスタイルのどちらか、もしくは両方を配置できます。<br/>
    - タイルは1枚しか保持できません。2枚所持してターンを終了する場合、どちらか一方を捨てる必要があります。<br/>
</div>

<p>1. 柱の配置</p>
<div className="remarks">
    <p>
    テラスタイルを置く前に、柱を配置します。<br/>
    柱は、プレイヤーボード上の空いているマス、または既にあるテラスタイルの上に設置できます。<br/>
    </p>
    <p>
    - プレイヤーボードの建設エリアには、64個の柱用のくぼみがあります。<br/>
    - テラスタイルの庭園面には、柱を置けるスペースが4か所あります。<br/>
    （柱の配置はシンボルの有無に依存しませんが、柱が置かれたシンボルは無効になります）<br/>
    </p>
    <p>
    一段柱2本で二段柱にすることができます。（一段柱を設置後、もう一度クリックしてください。）<br/>
    <br/>
    ※本来のルールでは二段柱を一段柱に戻すことはできず、二段柱をターン終了後に保持することはできませんが、<br/>
    プレイの仕様上不要でも問題ないため考慮していません。<br/>
    </p>
</div>

<p>2. テラスタイルの配置</p>
<div className="remarks">
    <p> 以下のルールに従ってテラスタイルを配置できます。</p>
    <p>
        - (1) 3～4本の柱（または彫像）の上に庭園面を上にして配置します。3本しか使わない場合は、支えのない角に <b>展望台</b> を即座に配置します。<br/>
        - (2) 彫像を柱として使用できます。（以後、彫像としては扱われないため、彫像の配置ルール適用外となります）<br/>
        - (3) 2枚のテラスタイルを完全に重なる形で配置することはできません。<br/>
        - (4) 階層を飛ばしてテラスタイルを置くことはできません。（1階層がない状態で 2階層を作れません）<br/>
    </p>
    <p>テラスタイル配置後、装飾を配置することができます。（配置ルールは「3.装飾」を参照）</p>
</div>
<p>
※配置した柱は、すべてテラスタイルで覆われている必要があります。<br/>
（ここでは、タイル配置後プレイヤーボード上に柱が余った場合は自動で回収されます）
</p>
<p>※また、ターン終了時（装飾配置後）、柱は6本まで保持されます。（採掘場で取得した柱はターン中であれば6本を超えて所持・使用できます）</p>

<hr className="overview"/>
<span className="en">
<p>
After digging, you can place the Terrace tile you just chose AND/OR the Terrace tile in your storage area.<br/>
You must place pillars before placing a Terrace tile.<br/>
A (single or double) pillar must be placed on an empty space on a player board or a Terrace tile.<br/>
</p>
<p>
The building area on your player board has 64 notches for placing pillars. <br/>
The Garden side of Terrace tiles has 4 spaces for placing pillars (with or without symbols). <br/>
You can swap 2 single pillars for 1 double pillar at any time. However, a double pillar cannot be swapped for 2 single pillars. <br/>
</p>
<p> Once your pillars are in position, place your Terrace tile, following these rules: </p>
<p>
- A Terrace tile may be placed Garden side up on 3 or 4 pillars. <br/>
If you only use 3 pillars, place a Belvedere immediately on the corner of the tile not resting on a pillar. <br/>
- 2 Terrace tiles may never overlap completely. <br/>
- A Terrace tile may rest entirely or partially on double pillars when it is placed. For example, <br/>
a tile can rest on 2 single pillars placed on a first-level tile and 2 double pillars placed on the player board. <br/>
</p>

<p>
Note : <br/>
- A statue can be used as a pillar to support a Terrace tile, after which it is no longer considered a statue. <br/>
- You must build your garden one level at a time.  <br/>
For example, you may only place a Terrace tile on the third level if you have a Terrace tile on the second level, even if they are far apart. <br/>
- All pillars placed must be covered by a Terrace tile. <br/>
</p>
</span>
</>