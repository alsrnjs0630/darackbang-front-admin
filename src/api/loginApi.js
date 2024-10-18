import axios from "axios";
import {API_SERVER_HOST} from "./host";
const prefix = `${API_SERVER_HOST}/admin`;

/**
 * 로그인 API 호출
 * @param email
 * @param password
 * @returns {Promise<any>}
 */
export const authLogin = async (email, password) => {
    const header = {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
    };

    const form = new FormData();
    form.append('username', email);
    form.append('password', password);

    try {
        const response = await axios.post(`${prefix}/login`, form, header);
        return response.data;
    } catch (error) {
        console.error("로그인 중 오류가 발생했습니다:", error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
};


// 로그아웃 API 호출
export const authLogout = async () => {
    const header = {
        headers: {"Content-Type": "application/json"},
        withCredentials: true  // 쿠키를 함께 전송하기 위해 withCredentials 설정
    };

    try {
        const response = await axios.post(`${prefix}/logout`, {}, header);
        return response.data;
    } catch (error) {
        console.error("로그아웃 중 오류가 발생했습니다:", error);
        throw error;  // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
};