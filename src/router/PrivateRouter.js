import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRouter = ({ children }) => {
    const isLogin = useSelector((state) => state.loginSlice.isLogin);
    const roleNames = useSelector((state) => state.loginSlice.roleNames); // roleNames 가져오기

    // 로그인 여부와 권한 체크
    const hasAccess = isLogin && roleNames?.some(role => role === 'MANAGER' || role === 'ADMIN');

    return hasAccess ? children : <Navigate to="/" />;
};

export default PrivateRouter;