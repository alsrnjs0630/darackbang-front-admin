import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/members`;
/**
 * 리스트
 * @param pageParam
 * @returns {Promise<any>}
 */
export const getList = async (pageParam) => {
    const {page, size,userEmail, name,gender,phoneNo,isBlacklist ,memberState} = pageParam
    const res = await axios.get(`${prefix}/list`,{params:{page:page,size:size, userEmail:userEmail,name:name ,gender:gender ,phoneNo:phoneNo ,isBlacklist:isBlacklist ,memberState:memberState }});
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
export const updates = async (id) => {
    const res = await axios.put(`${prefix}/${id}`)
    console.log(res.data);
    return res.data;
}


/**
 * 일기
 * @param pno
 * @returns {Promise<any>}
 */
export const deletes = async (id) => {
    const res = await axios.delete(`${prefix}/${id}`)
    console.log(res.data);
    return res.data;
}
