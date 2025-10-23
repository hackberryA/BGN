import { NAME_COLOR_LIST } from "../const/const";

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
const words: Record<string, string> = {
  "0": "moon", "1": "sun", "2": "wind", "3": "fire", "4": "rain",
  "5": "stone", "6": "tree", "7": "river", "8": "cloud", "9": "star",
  "a": "apple", "b": "bird", "c": "cat", "d": "dragon", "e": "end",
  "f": "fox", "g": "gold", "h": "honey", "i": "ice", "j": "jade",
  "k": "king", "l": "leaf", "m": "mint", "n": "night", "o": "owl",
  "p": "pearl", "q": "quill", "r": "rose", "s": "stone", "t": "tide",
  "u": "umbra", "v": "vine", "w": "wolf", "x": "xeno", "y": "yarn", "z": "zephyr",
};
export const randomRoomId = () => {
  return generateUUID().slice(0, 4).split("") .map((c) => words[c] || "?") .join("-");
}

export const getCuurrentTime = () => {
  const d = new Date();
  const mm = String(d.getHours()).padStart(2, "0");
  const dd = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${mm}:${dd}:${ss}`;
}

export const randomColor = () => {
  return NAME_COLOR_LIST[Math.floor(Math.random() * (NAME_COLOR_LIST.length))]
}