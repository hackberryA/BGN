type MessageType = {
    msg?: string,
    buttonName?: string
}
/**
 * メッセージ
 * @param msg: メッセージ 
 * @param buttonName: ボタン名
 * @returns 
 */
const Message = ({msg="", buttonName=""}: MessageType) => {
    return (
        <div className="row">
            <div 
                className="col s12 yellow lighten-3 valign-wrapper center" 
                style={{height: "35px", width: "100%" }}
            >
                <h6 className="center-align m0" style={{lineHeight: "35px"}}>
                    {msg || "完成するまでお待ちください。"}
                </h6>
                <button className="btn waves-effect waves-light btn-small green darken-1" type="submit" name="action">
                    {buttonName || "開始できません"}
                </button>
            </div>
        </div>
    )
}
export default Message