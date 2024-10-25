import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/events`;

/**
 * 이벤트 등록
 * @param formData
 * @returns {Promise<any>}
 */
export const create = async (formData) => {
    try {
        const res = await axios.post(`${prefix}/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("이벤트 등록 중 오류가 발생했습니다:", error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}

/**
 * 이벤트 목록 조회
 * @param pageParam
 * @returns {Promise<any>}
 */
export const getList = async (pageParam) => {
    const {page, size, title, content, eventState} = pageParam;
    try {
        const res = await axios.get(`${prefix}/list`, {
            params: {
                page: page,
                size: size,
                title: title,
                contents: content,
                eventState: eventState
            },
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });

        console.log("getList :{}", res.data);
        return res.data;
    } catch (error) {
        console.error("이벤트 목록을 가져오는 중 오류가 발생했습니다:", error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}