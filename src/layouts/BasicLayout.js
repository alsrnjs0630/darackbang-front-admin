import {
    Card,
    Typography,
    List,
    ListItem,
    Button,
} from "@material-tailwind/react";


import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../reducer/loginSlice';  // Redux logout action

const BasicLayout = ({children}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목 상태 관리

    const loginState = useSelector(state => state.loginSlice);


    console.log("loginState:{}",loginState)

    const handleNavigation = (path, itemName) => {
        setSelectedItem(itemName); // 선택된 항목 설정
        navigate(path); // 페이지 이동
    };

    const handleLogout = async () => {
        try {
            // 로그아웃 요청
            await axios.post('http://localhost:8080/admin/logout');

            // 로그아웃 성공 시 로그인 페이지로 리다이렉트
            dispatch(logout()); // Redux에서 로그아웃 처리
            navigate('/');

        } catch (error) {
            console.error("로그아웃 중 오류 발생: ", error);
        }
    };

    return (
        <>
            <div className={"bg-white flex h-screen"}>
                <Card
                    className="h-full w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/2  flex flex-col">
                    <div className="mb-2 p-4">
                        <Typography variant="h5" color="blue-gray">
                            관리자 메뉴
                        </Typography>
                    </div>
                    <List className="flex-grow">
                        <ListItem
                            className={`${selectedItem === "상품관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => handleNavigation("/dashboard/products/list", "상품관리")}
                        >
                            상품관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "회원관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => handleNavigation("/dashboard/members/list", "회원관리")}
                        >
                            회원관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "구매관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => handleNavigation("/dashboard/orders/list", "구매관리")}
                        >
                            구매관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "결제관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => handleNavigation("/dashboard/payments/list", "결제관리")}
                        >
                            결제관리
                        </ListItem>
            {/*            <ListItem
                            className={`${selectedItem === "공지사항관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setSelectedItem("공지사항관리")}
                        >
                            공지사항관리
                        </ListItem>

                        <ListItem
                            className={`${selectedItem === "Q&A관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setSelectedItem("Q&A관리")}
                        >
                            Q&A관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "이벤트관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setSelectedItem("이벤트관리")}
                        >
                            이벤트관리
                        </ListItem>*/}
                        <ListItem
                            className={`${selectedItem === "매출통계관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => handleNavigation("/dashboard/statistics/all", "매출통계관리")}
                        >
                            매출통계관리
                        </ListItem>
                    </List>

                    <div className="mt-4 p-4 flex flex-col items-center">
                        {loginState.isLogin ? (
                            <>
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    {loginState.name}님 환영합니다
                                </Typography>
                                <Button color="blue" size="lg" className="mt-2" onClick={handleLogout}>
                                    로그아웃
                                </Button>
                            </>
                        ) : (
                            <Button
                                color="blue"
                                size="lg"
                                className="mt-2"
                                onClick={() => navigate('/')}
                            >
                                로그인
                            </Button>
                        )}
                    </div>
                </Card>

                <main className={"bg-sky-300 flex-1 px-5 py-5"}>
                    <Outlet/>
                </main>
            </div>
        </>
    );
}

export default BasicLayout;
