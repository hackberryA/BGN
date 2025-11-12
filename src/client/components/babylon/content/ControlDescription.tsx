import { useState } from "react"
import { useBabylonWebSocket } from "../../../hooks/useBabylonWebSocket"
import { QuarryTile } from "./QuarryTile";

/**
 * 操作説明
 */
export const ControlDescription = () => {
    const [hide, setHide] = useState(true)

    return <div className="row debug-info-wrapper" >
        <div className="right debug-info-button" onClick={()=>setHide(!hide)}>[操作説明]</div>
        {!hide && <div className="row control-hint">
            <div className="col s5" style={{borderRight: "skyblue dotted 1px", float: "left", paddingRight: "15px"}}>
                <span className="control-hint-title">【カメラ操作】</span><br/>
                ・右クリック ： 回転<br/>
                ・中クリック ： 移動<br/>
                ・ホイール　 ： 拡大・縮小<br/>
                <br/>
                カメラが動かない場合はキャンバス下端をクリックで再描画
            </div>
            <div className="col s7" style={{float: "left"}}>
                <span className="control-hint-title">【オブジェクト操作】</span>（左クリック）<br/>
                ・柱 ： 配置 ➡ 段数変更 ➡ 解除<br/>
                ・タイル ： 配置 ➡ 回転 （設置解除はボタン）<br/>
            </div>
        </div>}
    </div>
}