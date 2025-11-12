import { useEffect } from "react";
import { useBabylonWebSocket } from "../../hooks/useBabylonWebSocket";


export const Loading = () => {
    const {isLoading} = useBabylonWebSocket()
    useEffect(()=>{
        document.querySelector('body')!.style.overflow = "hidden"
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // 一度だけ表示したいので監視解除
                obs.unobserve(entry.target);
            }
            });
        }, {
            threshold: 0.2 // 要素が20%見えたら発火
        });
        observer.observe(document.getElementById("loading-img")!);
    },[])
    useEffect(()=>{
        if (!isLoading) {
            //ローディング画面を取得

            // 1秒後にローディング画面を非表示にする
            setTimeout(() => {
                document.getElementById("loading")!.classList.add("loaded");
                document.querySelector('body')!.style.overflow = ""
                window.scroll(0, 0)
            }, 3000);
            // 5秒後に操作可能にする
            setTimeout(() => {
                document.getElementById("loadingDummy")!.classList.add("loaded");
                document.querySelector('body')!.style.overflow = ""
                window.scroll(0, 0)
            }, 6000);
        }
    }, [isLoading])
    return <>
    {/* ローディング画面 */}
        <div id="loadingDummy" className="loadingDummy">
            <p className="loading-text">Now Loading...</p>
        </div>
        <div id="loading" className="loading">
            <div id="loading-img" className="loading-img" style={{ backgroundImage: "url(/images/walking-nanoha.gif)" }}>
            </div>
            <p className="loading-text">Now Loading...</p>
            {/* <div className="spinner"></div> */}
        </div>
    </>
}