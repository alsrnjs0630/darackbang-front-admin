import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../../component/login/LoginComponent';
import { useDispatch } from "react-redux";
import { login } from "../../reducer/loginSlice";
import { authLogin } from "../../api/loginApi"; // Import the login API function
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import useCustomLogin from "../../component/hooks/useCustomLogin"; // Import Dialog components from Material Tailwind

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
    const [modalMessage, setModalMessage] = useState(''); // Modal message state

    const {exceptionHandle} = useCustomLogin()

    const handleLogin = async (email, password) => {

            // 로그인 API 호출
            authLogin(email, password).then(data => {
                // 성공적인 로그인 응답 처리
                if (data.error === "ERROR_LOGIN") {
                    setModalMessage("로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.");
                    setIsModalOpen(true); // Modal 열기
                } else {
                    setModalMessage("로그인 성공");
                    setIsModalOpen(true); // Modal 열기

                    // 로그인 데이터를 Redux 스토어에 저장
                    dispatch(login(data));
                }
            }).catch(error => {
                exceptionHandle(error);
            });

    };

    const closeModal = () => {
        setIsModalOpen(false); // Modal 닫기
        if (modalMessage === "로그인 성공") {
            navigate('/dashboard/products/list'); // 로그인 성공 후 대시보드로 이동
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <LoginComponent handleLogin={handleLogin} />

            {/* 로그인 결과 모달 */}
            <Dialog open={isModalOpen} handler={closeModal}>
                <DialogHeader>알림</DialogHeader>
                <DialogBody divider>
                    {modalMessage}
                </DialogBody>
                <DialogFooter>
                    <Button color="blue" onClick={closeModal}>
                        확인
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default LoginPage;
