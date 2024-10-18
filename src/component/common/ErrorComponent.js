import React from 'react';
import { useNavigate } from "react-router-dom";
import {Button, Card, Typography} from "@material-tailwind/react";
import {logout} from "../../reducer/loginSlice";
import {persistor} from "../../store";
import {useDispatch} from "react-redux";

const ErrorComponent = ({ errorMessage, errorCode }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleError = () => {

        if (errorMessage === 'REQUIRE_LOGIN' || errorMessage === 'ACCESSDENIED') {
            dispatch(logout()); // Redux에서 로그아웃 처리
            persistor.flush();
            persistor.purge();
            localStorage.removeItem('persist:root'); // 필요시 키를 조정
            navigate({ pathname: '/', search: errorMessage });
            return;
        }


        if(errorCode==='ERR_NETWORK'){
            dispatch(logout()); // Redux에서 로그아웃 처리
            // 진행 중인 persist 작업을 먼저 flush
            persistor.flush();
            // redux-persist에서 유지된 상태를 purge
            persistor.purge();
            // localStorage에서 유지된 상태를 삭제
            localStorage.removeItem('persist:root'); // 필요시 키를 조정
        }

        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Card className="max-w-md w-full shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col items-center">
                        <div
                            className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01M12 5h.01M12 17h.01"
                                />
                                <circle cx="12" cy="12" r="10" stroke="currentColor"/>
                            </svg>
                        </div>
                        <Typography variant="h2" className="text-gray-800 text-center">
                            문제원인
                        </Typography>
                        <Typography variant="paragraph" className="mt-2 text-gray-600 text-center">
                            {errorMessage || "예기치 않은 오류가 발생했습니다. 나중에 다시 시도해 주세요."}
                        </Typography>
                        {errorCode && (
                            <Typography variant="small" className="mt-2 text-gray-600 text-center">
                                <strong>에러 코드:</strong> {errorCode}
                            </Typography>
                        )}
                        <Button
                            onClick={handleError}
                            color="red"
                            className="mt-6 w-full"
                        >
                            {errorMessage === 'REQUIRE_LOGIN' || errorMessage === 'ACCESSDENIED' ? '로그인' : '돌아가기'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ErrorComponent;
