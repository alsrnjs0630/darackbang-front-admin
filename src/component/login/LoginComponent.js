import React, { useState } from 'react';
import {Input, Button, Card, CardBody, Dialog, DialogHeader, DialogBody, DialogFooter} from '@material-tailwind/react';
import {authLogin} from "../../api/loginApi";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import useCustomHook from "../hooks/useCustomHook";
import {login} from "../../reducer/loginSlice";

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {exceptionHandler} = useCustomHook()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
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
            exceptionHandler(error);
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
    const [modalMessage, setModalMessage] = useState(''); // Modal message state


    const closeModal = () => {
        setIsModalOpen(false); // Modal 닫기
        if (modalMessage === "로그인 성공") {
            navigate('/dashboard/statistics/all'); // 로그인 성공 후 대시보드로 이동
        }
    };


    return (
        <Card className="w-96">
            <CardBody>
                <h2 className="text-center text-2xl font-bold mb-6">다락방 로그인</h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        label="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        label="패스워드"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" color="blue" fullWidth>
                        관리자 로그인
                    </Button>
                </form>
            </CardBody>
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
        </Card>
    );
};

export default LoginComponent;
