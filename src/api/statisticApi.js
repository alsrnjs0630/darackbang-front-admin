import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/statistics`;

/**
 * 통계 데이터 가져오기
 * @returns {Promise<any>}
 */
export const getAll = async () => {
    const res = await axios.get(`${prefix}/all`);
    return res.data;
}


export const getAgeGroupTotal = async () => {
    const res = await axios.get(`${prefix}/age/total`);
    return res.data;
}

export const getProductTotal = async () => {
    const res = await axios.get(`${prefix}/product/total`);
    return res.data;
}

/**
 * 통계 데이터 가져오기
 * @returns {Promise<any>}
 */
export const getAgeGroupYearStat = async (year) => {
    const res = await axios.get(`${prefix}/age/year/${year}`);
    return res.data;
}

export const getAgeGroupQuarterStat = async (year, quarter) => {
    const res =  await axios.get(`${prefix}/age/quarter/${year}/${quarter}`);
    return res.data;
}

export const getAgeGroupMonthStat = async (year, month) => {
    const res =  await axios.get(`${prefix}/age/month/${year}/${month}`);
    return res.data;
}

/**
 * 통계 데이터 가져오기
 * @returns {Promise<any>}
 */
export const getProductYearStat = async (year) => {
    const res =  await axios.get(`${prefix}/product/year/${year}`);
    return res.data;
}

export const getProductQuarterStat = async (year, quarter) => {
    const res =  await axios.get(`${prefix}/product/quarter/${year}/${quarter}`);
    return res.data;
}

export const getProductMonthStat = async (year, month) => {
    const res =  await axios.get(`${prefix}/product/month/${year}/${month}`);
    return res.data;
}
