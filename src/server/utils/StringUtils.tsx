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
/**
 * @returns ルームIDランダム生成
 */
export const randomRoomId = (length=4) => {
  return generateUUID().slice(0, length).split("") .map((c) => words[c] || "?") .join("-");
}

/**
 * @returns 現在時刻("hh:mm:ss")
 */
export const getCuurrentTime = () => {
  const dt = new Date();
  const h = String(dt.getHours()).padStart(2, "0");
  const m = String(dt.getMinutes()).padStart(2, "0");
  const s = String(dt.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}