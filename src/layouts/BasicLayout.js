import React, {useState} from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import {Outlet, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../reducer/loginSlice";
import {authLogout} from "../api/loginApi";
import useCustomLogin from "../component/hooks/useCustomLogin";
import {persistor} from '../store'; // Import the persistor

const BasicLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {exceptionHandle} = useCustomLogin()

    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목 상태 관리

    const [isModalOpen, setIsModalOpen] = useState(false); // 로그아웃 확인 모달 상태 관리
    const [modalMessage, setModalMessage] = useState(""); // 모달 메시지 관리
    const [confirmAction, setConfirmAction] = useState(null); // 확인 모달 실행 함수

    // 모달 열기
    const openModal = (message, action = null) => {
        setModalMessage(message); // 모달 메시지 설정
        setConfirmAction(() => action); // 확인 시 실행할 함수 설정
        setIsModalOpen(true); // 모달 열기
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
        setConfirmAction(null); // 확인 함수 초기화
    };

    const loginState = useSelector((state) => state.loginSlice);

    const handleNavigation = (path, itemName) => {
        setSelectedItem(itemName); // 선택된 항목 설정
        navigate(path); // 페이지 이동
    };

    const handleLogout = async () => {

        authLogout()
            .then(data => {
                console.log("로그아웃 데이터:{}", data);

                if (data.RESULT === "LOGOUT SUCCESS") {
                    openModal("로그아웃 하였습니다.", () => {
                        dispatch(logout()); // Redux에서 로그아웃 처리
                        // 진행 중인 persist 작업을 먼저 flush
                        persistor.flush();
                        // redux-persist에서 유지된 상태를 purge
                        persistor.purge();
                        // localStorage에서 유지된 상태를 삭제
                        localStorage.removeItem('persist:root'); // 필요시 키를 조정
                        // 메인 페이지로 이동
                        navigate("/");
                    });
                }
            })
            .catch(error => {
                exceptionHandle(error)
            });

    };


    // 확인 모달의 동작 수행 함수
    const executeConfirmAction = () => {
        if (confirmAction) {
            confirmAction(); // 확인 모달에서 설정한 함수 실행
        }
        closeModal(); // 모달 닫기
    };


    return (
        <>
            <div className={"bg-white flex h-screen"}>
                <Card className="h-full w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/2 flex flex-col">
                    <div className="mb-2 p-4">
                        <Typography variant="h5" color="blue-gray">
                            관리자 메뉴
                        </Typography>
                    </div>
                    <List className="flex-grow">
                        <ListItem
                            className={`${
                                selectedItem === "상품관리" ? "bg-gray-200 font-bold" : ""
                            }`}
                            onClick={() =>
                                handleNavigation("/dashboard/products/list", "상품관리")
                            }
                        >
                            상품관리
                        </ListItem>
                        <ListItem
                            className={`${
                                selectedItem === "회원관리" ? "bg-gray-200 font-bold" : ""
                            }`}
                            onClick={() =>
                                handleNavigation("/dashboard/members/list", "회원관리")
                            }
                        >
                            회원관리
                        </ListItem>
                        <ListItem
                            className={`${
                                selectedItem === "구매관리" ? "bg-gray-200 font-bold" : ""
                            }`}
                            onClick={() =>
                                handleNavigation("/dashboard/orders/list", "구매관리")
                            }
                        >
                            구매관리
                        </ListItem>
                        <ListItem
                            className={`${
                                selectedItem === "결제관리" ? "bg-gray-200 font-bold" : ""
                            }`}
                            onClick={() =>
                                handleNavigation("/dashboard/payments/list", "결제관리")
                            }
                        >
                            결제관리
                        </ListItem>
                        <ListItem
                            className={`${
                                selectedItem === "매출통계관리" ? "bg-gray-200 font-bold" : ""
                            }`}
                            onClick={() =>
                                handleNavigation("/dashboard/statistics/all", "매출통계관리")
                            }
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
                                <Button
                                    color="blue"
                                    size="lg"
                                    className="mt-2"
                                    onClick={() => openModal("로그아웃 하시겠습니까?", handleLogout)}
                                >
                                    로그아웃
                                </Button>
                            </>
                        ) : (
                            <Button
                                color="blue"
                                size="lg"
                                className="mt-2"
                                onClick={() => navigate("/")}
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

            {/* 확인 모달 */}
            <Dialog open={isModalOpen} handler={closeModal}>
                <DialogHeader>알림</DialogHeader>
                <DialogBody divider>
                    {modalMessage}
                </DialogBody>
                <DialogFooter>
                    {confirmAction ? (
                        <>
                            <Button color="red" onClick={closeModal} className="mr-2">취소</Button>
                            <Button color="blue" onClick={executeConfirmAction} className="ml-2">확인</Button>
                        </>
                    ) : (
                        <Button color="blue" onClick={closeModal}>확인</Button>
                    )}
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default BasicLayout;
