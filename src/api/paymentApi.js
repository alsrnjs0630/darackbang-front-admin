import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/payments`;
/**
 * 리스트
 * @param pageParam
 * @returns {Promise<any>}
 */
export const getList = async (pageParam) => {
    const {page, size,buyerName, pgProvider,paidAmount,success} = pageParam
    const res = await axios.get(`${prefix}/list`,{params:{page:page,size:size, buyerName:buyerName,pgProvider:pgProvider ,paidAmount:paidAmount,success:success }});
    return res.data;
}

/**
 * 일기
 * @param pno
 * @returns {Promise<any>}
 */
export const getOne = async (id) => {
    const res = await axios.get(`${prefix}/${id}`)
    console.log(res.data);
    return res.data;
}
