import {
    Card,
    Typography,
    List,
    ListItem,
    Button,
} from "@material-tailwind/react";
import {Outlet, useNavigate} from "react-router-dom";
import {useState} from "react";

const BasicLayout = ({children}) => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목 상태 관리

    const handleNavigation = (path, itemName) => {
        setSelectedItem(itemName); // 선택된 항목 설정
        navigate(path); // 페이지 이동
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
                            onClick={() => handleNavigation("/product/list", "상품관리")}
                        >
                            상품관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "회원관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => handleNavigation("/member/list", "회원관리")}
                        >
                            회원관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "구매관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setSelectedItem("구매관리")}
                        >
                            구매관리
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
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "공지사항관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setSelectedItem("공지사항관리")}
                        >
                            공지사항관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "결제관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setSelectedItem("결제관리")}
                        >
                            결제관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "매출통계관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setSelectedItem("매출통계관리")}
                        >
                            매출통계관리
                        </ListItem>
                        <ListItem
                            className={`${selectedItem === "공통관리" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setSelectedItem("공통관리")}
                        >
                            공통관리
                        </ListItem>
                    </List>

                    <div className="mt-4 p-4 flex flex-col items-center">
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            관리자님 환영합니다
                        </Typography>
                        <Button color="blue" size="lg" className="mt-2">
                            로그아웃
                        </Button>
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
