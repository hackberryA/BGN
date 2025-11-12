import { BabylonDataType } from "../types/BabylonTypes";

/**
 * @returns generate UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
/**
 * ランダムワードリスト
 */
const words: Record<string, string> = {
  "0": "moon", "1": "sun", "2": "wind", "3": "fire", "4": "rain",
  "5": "stone", "6": "tree", "7": "river", "8": "cloud", "9": "star",
  "a": "apple", "b": "bird", "c": "cat", "d": "dragon", "e": "end",
  "f": "fox", "g": "gold", "h": "honey", "i": "ice", "j": "jade",
  "k": "king", "l": "leaf", "m": "mint", "n": "night", "o": "owl",
  "p": "pearl", "q": "quill", "r": "rose", "s": "stone", "t": "tide",
  "u": "umbra", "v": "vine", "w": "wolf", "x": "xeno", "y": "yarn",
  "z": "zephyr", "-": "hyphen",
};

export const randInt = (max: number) => {
  return Math.floor(Math.random() * (max))
}
/**
 * @returns ルームIDランダム生成
 */
export const randomRoomId = (length=4) => {
  return generateUUID().slice(0, length).split("") .map((c) => words[c] || "?") .join("-");
}

/**
 * @returns 現在時刻("hh:mm:ss")
 */
export const getCurrentTime = () => {
  const dt = new Date();
  const h = String(dt.getHours()).padStart(2, "0");
  const m = String(dt.getMinutes()).padStart(2, "0");
  const s = String(dt.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}


export const isObject = (s: any) => {
  return s && typeof s === "object" && !Array.isArray(s) 
} 

export function shuffleArray<T> (arr: T[]) {
  if (!Array.isArray(arr)) return [];
  const tmp = [...arr];
  for (let i = tmp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 0〜iのランダムな整数
      [tmp[i], tmp[j]] = [tmp[j], tmp[i]]; // 要素を入れ替える
  }
  return [...tmp]
}