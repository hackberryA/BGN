import { useState } from "react";
import { generateUUID } from "three/src/math/MathUtils";
import { USERID, USERNAME } from "../const/const";

export const useStorage = () => {
    const [userId] = useState<string>(() => {
        const userId = localStorage.getItem(USERID);
        if (userId) return userId;

        const newId = generateUUID();
        localStorage.setItem("userid", newId);
        return newId;
    });
    const userName = localStorage.getItem(USERNAME) || "";
    const setUserName = (userName: string) => {
        localStorage.setItem(USERNAME, userName);
    }

    return {userId, userName, setUserName};
}
