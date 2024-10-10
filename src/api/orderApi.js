import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/orders`;
/**
 * 리스트
 * @param pageParam
 * @returns {Promise<any>}
 */
export const getList = async (pageParam) => {
    const {page, size,totalOrderPrice, userEmail,name} = pageParam
    const res = await axios.get(`${prefix}/list`,{params:{page:page,size:size, totalOrderPrice:totalOrderPrice,userEmail:userEmail ,name:name }});
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
