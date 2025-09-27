// --------------------------------------------------
// DOM操作
// --------------------------------------------------
const d = (id) => document.getElementById(id)

export const setInnerText = (id, text) => {
    const obj = d(id);
    if (obj) obj.innerText = text;
}
export const setInnerHTML = (id, text) => {
    const obj = d(id);
    if (obj) obj.innerHTML = text;
}
export const setOnclick = (id, callback) => {
    const obj = d(id);
    if (obj) obj.onclick = callback
}
export const getValue = (id) => {
    const obj = d(id);
    return obj ? d(id).value : undefined
}
export const setValue = (id, value) => {
    const obj = d(id);
    if(obj) obj.value = value
}
