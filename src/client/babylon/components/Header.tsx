

const Header = () => {
    return <div className="row blue lighten-2 white-text valign-wrapper m0">
        <div className="col s3">
            <h5>Babylonia</h5>
        </div>
        <div className="col s9 ">
            <div className="right valign-wrapper">
                <div className="input-field col s9 p0">
                    <input id="input_text" type="text" className="validate white m0" maxLength={10}
                        style={{height: "20px", lineHeight: "20px"}} placeholder=" your name "></input>
                </div>
                <div className="col s4 p0">
                    <button id="joinRoom" className="btn waves-effect waves-light z-depth-0 blue darken-1"
                        style={{
                            marginBottom: "3px",
                            padding: "0px 5px",
                            height: "20px",
                            lineHeight: "20px",
                            fontSize: "50%"
                        }}>
                        入室
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default Header