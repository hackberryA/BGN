import { JSX, useEffect } from "react";
import M from 'materialize-css';

type TabsType = {
    id: string,
    list: {
        col: number,
        title?: {ja: string, en: string},
        content?: JSX.Element,
        hasTab?: boolean // Tab in Tab の場合 true (padding: 0 にする)
    }[]
}

const Tabs = ({id, list}: TabsType) => {
    useEffect(() => {
        const elm = document.querySelectorAll('.tabs')
        M.Tabs.init(elm , {}); // Materialize 初期化
    }, []); //初回レンダリング
    return (
        <>
            <div id={id} className="col s12 p0">
                <ul className="tabs">
                    {list.map(({col, title}, index) =>
                        <li className={`tab col s${col} p0 m0 tabs-tab`} key={index}>
                            {title && <a href={`#${id}-${index}`}>
                                {title.ja}<br/>
                                <span className="en">{title.en}</span>
                            </a>}
                        </li>
                    )}
                </ul>
                {list.map(({content, hasTab}, index) => content &&
                    <div id={`${id}-${index}`} className={`col s12 ${hasTab ? "p0" : "tab-content"}`}>
                        {content}
                    </div>
                )}
            </div>
        </>
    )
}

export default Tabs