// --------------------------------------------------
// DOM操作
// --------------------------------------------------
const d = (id: string) => document.getElementById(id)

const setInnerText = (id: string, text: string) => {
    const obj = d(id);
    if (obj) obj.innerText = text;
}
const setInnerHTML = (id: string, text: string) => {
    const obj = d(id);
    if (obj) obj.innerHTML = text;
}
const setOnclick = (id: string, callback: ()=>void) => {
    const obj = d(id);
    if (obj) obj.onclick = callback
}
const getValue = (id: string) => {
    const obj = d(id);
    return obj ? obj.getAttribute("value") : undefined
}
const setValue = (id: string, value: string) => {
    const obj = d(id);
    if(obj) obj.setAttribute("value", value)
}

export default { setInnerText, setInnerHTML, setOnclick, getValue, setValue }