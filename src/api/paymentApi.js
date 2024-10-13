import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/payments`;

/**
 * 결제 목록 조회
 * @param pageParam
 * @returns {Promise<any>}
 */
export const getList = async (pageParam) => {
    const {page, size, buyerName, pgProvider, paidAmount, success} = pageParam;
    try {
        const res = await axios.get(`${prefix}/list`, {
            params: {
                page: page,
                size: size,
                buyerName: buyerName,
                pgProvider: pgProvider,
                paidAmount: paidAmount,
                success: success
            },
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error("결제 목록을 가져오는 중 오류가 발생했습니다:", error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}

/**
 * 특정 결제 정보 조회
 * @param id
 * @returns {Promise<any>}
 */
export const getOne = async (id) => {
    try {
        const res = await axios.get(`${prefix}/${id}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error(`결제 ID ${id}의 정보를 가져오는 중 오류가 발생했습니다:`, error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}
