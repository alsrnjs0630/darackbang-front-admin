import axios from "axios";
import {API_SERVER_HOST} from "./host";

const prefix = `${API_SERVER_HOST}/admin/members`;

/**
 * 회원 목록 조회
 * @param pageParam
 * @returns {Promise<any>}
 */
export const getList = async (pageParam) => {
    const { page, size, userEmail, name, gender, phoneNo, isBlacklist, memberState } = pageParam;
    try {
        const res = await axios.get(`${prefix}/list`, {
            params: {
                page: page,
                size: size,
                userEmail: userEmail,
                name: name,
                gender: gender,
                phoneNo: phoneNo,
                isBlacklist: isBlacklist,
                memberState: memberState
            },
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        return res.data;
    } catch (error) {
        console.error("회원 목록을 가져오는 중 오류가 발생했습니다:", error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}

/**
 * 특정 회원 정보 조회
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
        console.error(`회원 ID ${id}의 정보를 가져오는 중 오류가 발생했습니다:`, error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}

/**
 * 회원 정보 업데이트
 * @param id
 * @returns {Promise<any>}
 */
export const updates = async (id) => {
    try {
        const res = await axios.put(`${prefix}/${id}`, {}, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error(`회원 ID ${id}의 정보를 업데이트하는 중 오류가 발생했습니다:`, error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}

/**
 * 회원 삭제
 * @param id
 * @returns {Promise<any>}
 */
export const deletes = async (id) => {
    try {
        const res = await axios.delete(`${prefix}/${id}`, {
            withCredentials: true // 쿠키를 함께 전송하기 위해 withCredentials 설정
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error(`회원 ID ${id}를 삭제하는 중 오류가 발생했습니다:`, error);
        throw error; // 에러를 다시 던져 호출자가 처리할 수 있도록 함
    }
}




// Get member by ID
export const getMemberById = async (id) => {
    try {
        const response = await axios.get(`${prefix}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching member:", error);
        throw error;
    }
};

// Update member
export const updateMember = async (member) => {
    const formData = new FormData();
    Object.keys(member).forEach((key) => {
        if (!['createdDate', 'updatedDate'].includes(key)) {
            formData.append(key, member[key]);
        }
    });

    const header = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
    };

    try {
        const response = await axios.put(`${prefix}`, formData, header);
        return response.data;
    } catch (error) {
        console.error("Error updating member:", error);
        throw error;
    }
};

// Handle member withdraw
export const withdrawMember = async (id) => {
    try {
        const response = await axios.put(`${prefix}/withdraw/${id}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error withdrawing member:", error);
        throw error;
    }
};

// Handle blacklist member
export const blacklistMember = async (id) => {
    try {
        const response = await axios.put(`${prefix}/blacklist/${id}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error blacklisting member:", error);
        throw error;
    }
};

// Remove from blacklist
export const removeBlacklistMember = async (id) => {
    try {
        const response = await axios.put(`${prefix}/unblacklist/${id}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error removing blacklist from member:", error);
        throw error;
    }
};

// Reactivate member
export const reactivateMember = async (id) => {
    try {
        const response = await axios.put(`${prefix}/active/${id}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error reactivating member:", error);
        throw error;
    }
};