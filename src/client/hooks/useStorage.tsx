import { useState } from "react";
import { USERID_KEY, USERNAME_KEY } from "../const/const";
import { generateUUID } from "../utils/StringUtils";

export const useStorage = () => {
    const [userId] = useState<string>(() => {
        const userId = localStorage.getItem(USERID_KEY);
        if (userId) return userId;

        const newId = generateUUID();
        localStorage.setItem("userid", newId);
        return newId;
    });
    const userName = localStorage.getItem(USERNAME_KEY) || "";
    const setUserName = (userName: string) => {
        localStorage.setItem(USERNAME_KEY, userName);
    }

    return {userId, userName, setUserName};
}
