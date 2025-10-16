import { BabylonCanvas } from "../BabylonCanvas";
import { BabylonRoomData, useBabylonRoomData } from "../../hooks/useBabylonRoomData";
import { useSocketContext } from "../../hooks/useWebSocket.tsx";


type ContentType = {roomData: BabylonRoomData}
const Content = ({roomData}: ContentType) => {
    const { send } = useSocketContext();

    // <script>
    //     const chat = document.getElementById('chat');
    //     const chatLAN = document.getElementById('chat-lan');
    //     const chatLen = document.getElementById('chat-len');
    //     chat.addEventListener('keydown', function (event) {
    //         if (event.key === 'Enter') {
    //             if (chat.value.trim()=="") return
    //             chatLAN.innerHTML += `<li className="collection-item" style="padding: 0 5px; line-height: 1.6;">PlayerA | ${chat.value.trim()} </li>`;
    //             chatLAN.scrollTop = chatLAN.scrollHeight;
    //             chat.value = "";
    //         } else {
    //             chatLen.innerText = chat.value.length
    //         }
    //     });
    //     chat.addEventListener('keyup', function (event) {
    //         chatLen.innerText = chat.value.length
    //     });
    // </script>
    return (
        <div className="row" style={{padding: "0px 20px"}}>
            {/* Quarry */}
            <div className="col s3">
                <div className="col s12 border2 valign-wrapper center"
                    style={{aspectRatio: "1/1", position: "relative"}}>
                    <span style={{position: "absolute", left:"3px", top:"0px"}}>Quarry</span>
                    ここに採掘場を描画
                    {/* <canvas id="main"></canvas> */}
                </div>
                <div className="col s12 border1 p0" style={{marginTop: "10px"}}>
                    <ul id="log" className="collection m0" style={{height: "180px", overflowY: "scroll", fontSize: "10px", lineHeight: 1.5}}>
                        {roomData.logs.slice().reverse().map((v) => <li className="collection-item" style={{padding: "0 5px", lineHeight: 1.6}}>{v}</li>)}
                    </ul>
                </div>
            </div>
            {/* Player Board */}
            <div className="col s7">
            {/* <div className="col s12 yellow lighten-3 valign-wrapper center" style="height: 35px; width: 100%; ">
                <h6 className="center-align m0" style=" line-height: 35px;">完成するまでお待ちください。</h6>
                <button className="btn waves-effect waves-light btn-small green darken-1" type="submit" name="action">開始できません</button>
            </div> */}
                <div id="wrapper-canvas" className="col s9 border3 valign-wrapper center p0" style={{aspectRatio: "1/1", position: "relative"}}>
                    <span style={{position: "absolute", left:"3px", top:"0px", zIndex:10}}>You</span>
                    <span style={{position: "absolute", right:"3px", top:"0px", zIndex:10}}>♜♜</span>
                    <img src="/images/500.png" className="border1 stock-tile-main" style={{zIndex:10}} />
                    {/* ここにプレイヤーボードを描画 */}
                    <BabylonCanvas playerId="test" />
                </div>
                <div className="col s3" style={{aspectRatio: "1/1"}}>
                    <div className="col s12 p0 border1" style={{aspectRatio: "1/1", position: "relative"}}>
                        <img src="/images/500.png" className="responsive-img" />
                        <span style={{position: "absolute", left:"3px", top:"0px"}}>playerA</span>
                        <span style={{position: "absolute", right:"3px", top: "0px"}}>♜♜♜♜♜♜</span>
                        <img src="/images/500.png" className="border1 stock-tile-sub" />
                    </div>
                    <div className="col s12 p0 border1" style={{aspectRatio: "1/1", position: "relative", marginTop: "10px"}}>
                        <img src="/images/500.png" className="responsive-img" />
                        <span style={{position: "absolute", left:"3px", top:"0px"}}>playerB</span>
                        <span style={{position: "absolute", right:"3px", top: "0px"}}>♜♜♜</span>
                        <img src="/images/500.png" className="border1 stock-tile-sub" />
                    </div>
                    <div className="col s12 p0 border1" style={{aspectRatio: "1/1", position: "relative", marginTop: "10px"}}>
                        <img src="/images/500.png" className="responsive-img" />
                        <span style={{position: "absolute", left:"3px", top:"0px"}}>playerC</span>
                        <span style={{position: "absolute", right:"3px", top: "0px"}}>♜♜</span>
                        <img src="/images/500.png" className="border1 stock-tile-sub" />
                    </div>
                </div>
            </div>
            <div className="col s2">
                <div className="row">
                    {/* Game Info */}
                    <div className="collection-item light-blue lighten-5">
                        <div className="card-content" style={{padding: "10px 12px", fontSize: "50%"}}>
                            ラウンド　 ：<span id="current-round">1</span>/<span id="max-round">14</span><br/>
                            プレイヤー ：<span id="current-player">nanoha</span><br/>
                            アクション ：<span id="current-action">タイル選択中</span><br/>
                        </div>
                    </div>
                    {/* Player Info */}
                    <div className="row s3 light-blue lighten-5">
                        <ul className="collection" style={{marginBottom: 0}}>
                            {Object.entries(roomData.playerInfo).map(([playerId, info], index) => 
                                <li className="collection-item">player{index+1}: {info.userName}</li>
                            )}
                            {roomData.playerLength < 1 && <li className="collection-item">player1:</li>}
                            {roomData.playerLength < 2 && <li className="collection-item">player2:</li>}
                            {roomData.playerLength < 3 && <li className="collection-item">player3:</li>}
                            {roomData.playerLength < 4 && <li className="collection-item">player4:</li>}
                        </ul>
                    </div>
                    {/* Chat */}
                    <div className="row s3 light-blue lighten-5 border1">
                        <ul id="chat-lan" className="collection m0" style={{height: "180px", overflowY: "scroll", fontSize: "10px", lineHeight: 1.5}}></ul>
                        <div className="valign-wrapper m0">
                            <div className="input-field col s12 p0">
                                <input id="chat" type="text" className="validate white m0"
                                    style={{height: "20px", lineHeight: "20px", fontSize: "50%"}} placeholder=" enter your message "
                                    maxLength={50} />
                                <div style={{position: "absolute", fontSize: "8px", color: "skyblue", right:"2px"}} aria-autocomplete="none">
                                    (<span id="chat-len">0</span>/50)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Content;