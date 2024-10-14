import axios from "axios";
import { API_SERVER_HOST } from "./host";
import useCustomLogin from "../component/hooks/useCustomLogin";

const prefix = `${API_SERVER_HOST}/admin/login`;



/**
 * 로그인 API 호출
 * @param email
 * @param password
 * @returns {Promise<any>}
 */
export const authLogin = async (email, password) => {
    const header = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
    };

    const form = new FormData();
    form.append('username', email);
    form.append('password', password);

    try {
        const response = await axios.post(prefix, form, header);
        return response.data;
    } catch (error) {

        if (error.code === 'ERR_NETWORK') {
            alert('서버와의 연결에 문제가 발생했습니다. 인터넷 연결을 확인하거나 다시 시도해주세요.');
        }else{
            alert("로그인 중 오류가 발생했습니다");
        }

        console.error("로그인 중 오류가 발생했습니다:", error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
};


// 로그아웃 API 호출
export const authLogout = async () => {
    const header = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true  // 쿠키를 함께 전송하기 위해 withCredentials 설정
    };

    try {
        const response = await axios.post('http://localhost:8080/admin/logout', {}, header);
        return response.data;
    } catch (error) {
        console.error("로그아웃 중 오류가 발생했습니다:", error);
        throw error;  // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
};