import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";
import LoginPage from "../pages/login/LoginPage";
import productsRouter from "./productsRouter";
import membersRouter from "./membersRouter";
import ordersRouter from "./ordersRouter";
import paymentsRouter from "./paymentsRouter";
import statisticsRouter from "./statisticsRouter";
import PrivateRouter from "./PrivateRouter";
import ErrorPage from "../pages/error/ErrorPage";
import analyzeRouter from "./analyzeRouter";
import eventRouter from "./eventRouter";

// Loading 컴포넌트를 함수로 정의
const Loading = () => <div>Loading...</div>;

const root = createBrowserRouter([
    {
        path: "/", //로그인 페이지 로딩
        element: <Suspense fallback={<Loading />}><LoginPage /></Suspense>,
    },
    {
        path: "/dashboard", // 로그인 후 접근하는 기본 URL 매핑 주소
        element: (
            <PrivateRouter>
                <Suspense fallback={<Loading />}>
                    <BasicLayout />
                </Suspense>
            </PrivateRouter>
        ),
        children: [
            {
                path: "products",
                children: productsRouter(),
            },
            {
                path: "members",
                children: membersRouter(),
            },
            {
                path: "orders",
                children: ordersRouter(),
            },
            {
                path: "payments",
                children: paymentsRouter(),
            },
            {
                path: "statistics",
                children: statisticsRouter(),
            },
            {
                path: "analyzes",
                children: analyzeRouter(),
            },
            {
                path: "events",
                children: eventRouter(),
            },
        ],
    },
    {
        path: "/error", //에러 처리 페이지 url
        element: <Suspense fallback={<Loading />}><ErrorPage /></Suspense>,
    },
]);

export default root;
