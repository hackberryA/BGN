// --------------------------------------------------
// DOM操作
// --------------------------------------------------
const d = (id) => document.getElementById(id)

const setInnerText = (id, text) => {
    const obj = d(id);
    if (obj) obj.innerText = text;
}
const setInnerHTML = (id, text) => {
    const obj = d(id);
    if (obj) obj.innerHTML = text;
}
const setOnclick = (id, callback) => {
    const obj = d(id);
    if (obj) obj.onclick = callback
}
const getValue = (id) => {
    const obj = d(id);
    return obj ? obj.getAttribute("value") : undefined
}
const setValue = (id, value) => {
    const obj = d(id);
    if(obj) obj.setAttribute("value", value)
}

export default { setInnerText, setInnerHTML, setOnclick, getValue, setValue }