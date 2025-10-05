/** 共通キー */
const COMMON_KEY = "7n7n8h7"
/** ユーザIDキー */
const USER_ID   = COMMON_KEY + "userId"
/** ユーザ名キー */
const USER_NAME = COMMON_KEY + "userName"

/**
 * ローカルストレージ
 */
export default class UserInfo {
    /** ユーザID */ id: string;
    /** ユーザ名 */ name: string;
    /**
     * コンストラクタ
     */
    constructor() {
        this.id = this.getUserId();
        if (this.id === "") {
            this.setUserId(crypto.randomUUID());
        }
        this.name = this.getUserName();
    }

    /** set userId */
    setUserId = (userId: string) => {
        localStorage.setItem(USER_ID, userId);
        this.id = userId;
    }
    /** get userId */
    getUserId = () => localStorage.getItem(USER_ID) ?? "";

    /** set userName */
    setUserName = (userName: string) => {
        localStorage.setItem(USER_NAME, userName);
        this.name = userName;
    }
    /** get userName */
    getUserName = () => localStorage.getItem(USER_NAME) ?? "";

    // --------------------------------------------------
    // remove
    // --------------------------------------------------
    // removeStroage = () => {
    //     localStorage.removeItem(USER_ID);
    //     localStorage.removeItem(USER_NAME);
    //     location.reload();
    // }
}