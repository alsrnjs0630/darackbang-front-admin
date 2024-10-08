import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../../component/login/LoginComponent';
import {useDispatch} from "react-redux"
import {login} from "../../reducer/loginSlice";
import axios from "axios";

const LoginPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const dispatch = useDispatch();

    const handleLogin = async (email, password) => {

        const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}

        const form = new FormData()
        form.append('username', email)
        form.append('password', password)

        const response = await axios.post(`http://localhost:8080/admin/login`, form, header)

        // Assuming the API returns a success response and some token data
        if (response.status === 200 && response.data) {
            alert("로그인 성공");
            // Dispatch user data to your Redux store
            dispatch(login(response.data));

            // Redirect to the dashboard on successful login
            navigate('/dashboard/products/list');
        } else {
            alert("로그인 실패: 올바른 자격 증명을 입력하세요.");
        }

    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <LoginComponent handleLogin={handleLogin} />
        </div>
    );
};

export default LoginPage;