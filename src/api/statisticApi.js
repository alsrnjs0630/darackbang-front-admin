import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/statistics`;

/**
 * 전체 통계 데이터 가져오기
 * @returns {Promise<any>}
 */
export const getAll = async () => {
    try {
        const res = await axios.get(`${prefix}/all`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error("전체 통계 데이터를 가져오는 중 오류가 발생했습니다:", error);
        throw error;
    }
}

export const getAgeGroupTotal = async () => {
    try {
        const res = await axios.get(`${prefix}/age/total`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error("연령대별 전체 금액 통계를 가져오는 중 오류가 발생했습니다:", error);
        throw error;
    }
}

export const getProductTotal = async () => {
    try {
        const res = await axios.get(`${prefix}/product/total`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error("상품별 전체 금액 통계를 가져오는 중 오류가 발생했습니다:", error);
        throw error;
    }
}

/**
 * 연령대별 연간 통계 데이터 가져오기
 * @returns {Promise<any>}
 */
export const getAgeGroupYearStat = async (year) => {
    try {
        const res = await axios.get(`${prefix}/age/year/${year}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error(`연령대별 ${year}년 통계 데이터를 가져오는 중 오류가 발생했습니다:`, error);
        throw error;
    }
}

export const getAgeGroupQuarterStat = async (year, quarter) => {
    try {
        const res =  await axios.get(`${prefix}/age/quarter/${year}/${quarter}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error(`연령대별 ${year}년 ${quarter}분기 통계 데이터를 가져오는 중 오류가 발생했습니다:`, error);
        throw error;
    }
}

export const getAgeGroupMonthStat = async (year, month) => {
    try {
        const res =  await axios.get(`${prefix}/age/month/${year}/${month}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error(`연령대별 ${year}년 ${month}월 통계 데이터를 가져오는 중 오류가 발생했습니다:`, error);
        throw error;
    }
}

/**
 * 상품별 연간 통계 데이터 가져오기
 * @returns {Promise<any>}
 */
export const getProductYearStat = async (year) => {
    try {
        const res =  await axios.get(`${prefix}/product/year/${year}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error(`상품별 ${year}년 통계 데이터를 가져오는 중 오류가 발생했습니다:`, error);
        throw error;
    }
}

export const getProductQuarterStat = async (year, quarter) => {
    try {
        const res =  await axios.get(`${prefix}/product/quarter/${year}/${quarter}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error(`상품별 ${year}년 ${quarter}분기 통계 데이터를 가져오는 중 오류가 발생했습니다:`, error);
        throw error;
    }
}

export const getProductMonthStat = async (year, month) => {
    try {
        const res =  await axios.get(`${prefix}/product/month/${year}/${month}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error(`상품별 ${year}년 ${month}월 통계 데이터를 가져오는 중 오류가 발생했습니다:`, error);
        throw error;
    }
}
