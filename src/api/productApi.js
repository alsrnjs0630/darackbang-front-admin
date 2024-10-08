import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/products`;
/**
 * 리스트
 * @param pageParam
 * @returns {Promise<any>}
 */
export const getList = async (pageParam) => {
    const {page, size,productName, salePrice} = pageParam
    const res = await axios.get(`${prefix}/list`,{params:{page:page,size:size, productName:productName,salePrice:salePrice }});
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



/**
 * 일기
 * @param pno
 * @returns {Promise<any>}
 */
export const create = async (formData) => {
    const res = await axios.post(`${prefix}`,formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    console.log(res.data);
    return res.data;
}