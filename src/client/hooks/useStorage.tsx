import { Dispatch, SetStateAction, useState } from "react";
import { generateUUID, randomColor } from "../utils/StringUtils";

// 定数
const COMMONKEY = "7na7no8ha7-"
const AUTH_KEY = `${COMMONKEY}auth`
const USERID_KEY = `${COMMONKEY}userId`
const USERNAME_KEY = `${COMMONKEY}userName`;
const PREUSERNAME_KEY = `${COMMONKEY}preuserName`;
const USERCOLOR_KEY = `${COMMONKEY}userColor`;

export type StorageType =  {
    userId: string;
    setUserId: (value: string) => void;
    userName: string;
    setUserName: (value: string) => void;
    preUserName: string;
    setPreUserName: (value: string) => void;
    auth: string;
    setAuth: (value: string) => void;
    userColor: string;
    setUserColor: (value: string) => void;
}

export const useStorage = () => {
    /** Auth */
    const [auth, setAuth] = useState("false");
    /** ユーザID */
    const [userId, setUserId] = useState(initUserId);
    /** ユーザ名 */
    const [userName, setUserName] = useState(localStorage.getItem(USERNAME_KEY) || "");
    /** ユーザ名(変更前) */
    const [preUserName, setPreUserName] = useState(localStorage.getItem(PREUSERNAME_KEY) || "");
    /** ユーザカラー */
    const [userColor, setUserColor] = useState(localStorage.getItem(USERCOLOR_KEY) || randomColor());

    return {
        userId,      setUserId:      setStateHandler(setUserId,      USERID_KEY),
        userName,    setUserName:    setStateHandler(setUserName,    USERNAME_KEY),
        preUserName, setPreUserName: setStateHandler(setPreUserName, PREUSERNAME_KEY),
        auth,        setAuth:        setStateHandler(setAuth,        AUTH_KEY),
        userColor,   setUserColor:   setStateHandler(setUserColor,   USERCOLOR_KEY),
    } as StorageType;
}
const setStateHandler = (setState: Dispatch<SetStateAction<string>>, key: string) => (value: string) => {
    setState(value)
    localStorage.setItem(key, value);
}


/** UserId初期化 */
const initUserId = () => {
    const userId = localStorage.getItem(USERID_KEY);
    if (userId) return userId;

    const newId = generateUUID();
    localStorage.setItem("userid", newId);
    return newId;
}