import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/products`;

/**
 * 상품 목록 조회
 * @param pageParam
 * @returns {Promise<any>}
 */
export const getList = async (pageParam) => {
    const {page, size, productName, salePrice} = pageParam;
    try {
        const res = await axios.get(`${prefix}/list`, {
            params: {
                page: page,
                size: size,
                productName: productName,
                salePrice: salePrice
            },
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });

        console.log("getList :{}",res.data);
        return res.data;
    } catch (error) {
        console.error("상품 목록을 가져오는 중 오류가 발생했습니다:", error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}

/**
 * 특정 상품 정보 조회
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
        console.error(`상품 ID ${id}의 정보를 가져오는 중 오류가 발생했습니다:`, error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}

/**
 * 상품 생성
 * @param formData
 * @returns {Promise<any>}
 */
export const create = async (formData) => {
    try {
        const res = await axios.post(`${prefix}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("상품을 생성하는 중 오류가 발생했습니다:", error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}



/**
 * 상품 삭제
 * @param id
 * @returns {Promise<any>}
 */
export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${prefix}/${id}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return response.data;
    } catch (error) {
        console.error("상품 삭제 중 오류가 발생했습니다:", error);
        throw new Error("상품을 삭제하는 도중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
};

/**
 * 상품 활성화
 * @param id
 * @returns {Promise<any>}
 */
export const activateProduct = async (id) => {
    try {
        const response = await axios.put(`${prefix}/active/${id}`, {}, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return response.data;
    } catch (error) {
        console.error("상품 활성화 중 오류가 발생했습니다:", error);
        throw new Error("상품을 활성화하는 도중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
};



/**
 * 상품 업데이트
 * @param formData
 * @returns {Promise<any>}
 */
export const updateProduct = async (formData) => {
    try {
        const response = await axios.put(`${prefix}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true 
        });
        return response.data;
    } catch (error) {
        console.error("상품 업로드 중 오류가 발생했습니다:", error);
        throw new Error("상품을 업로드하는 도중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
};

