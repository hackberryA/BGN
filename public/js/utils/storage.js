// --------------------------------------------------
// ローカルストレージ
// --------------------------------------------------
// キー
const COMMON_KEY = "7n7n8h7"
const STORAGE_USER_ID   = COMMON_KEY + "userid"
const STORAGE_USER_NAME = COMMON_KEY + "username"

// userid
export const setUserid = (value) => localStorage.setItem(STORAGE_USER_ID, value);
export const getUserid = () => localStorage.getItem(STORAGE_USER_ID);

// username
export const setUsername = (value) => localStorage.setItem(STORAGE_USER_NAME, value);
export const getUsername = () => localStorage.getItem(STORAGE_USER_NAME);

// remove
export const removeStroage = () => {
  localStorage.removeItem(STORAGE_USER_ID)
  localStorage.removeItem(STORAGE_USER_NAME)
  location.reload()
}

export const initialize = () => {
  if (!getUserid()) {
    setUserid(crypto.randomUUID());
  }
}