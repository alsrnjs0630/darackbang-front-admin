import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";
import LoginPage from "../pages/login/LoginPage";
import productsRouter from "./productsRouter";
import membersRouter from "./membersRouter";
import ordersRouter from "./ordersRouter";
import paymentsRouter from "./paymentsRouter";
import statisticsRouter from "./statisticsRouter";
import PrivateRouter from "./PrivateRouter";

const Loading = <div>Loading...</div>; // 로딩 문구

const root = createBrowserRouter([
    {
        path: "/", // Login page route without BasicLayout
        element: <Suspense fallback={Loading}><LoginPage /></Suspense>,
    },
    {
        path: "/dashboard", // Main application after login, with BasicLayout
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
        ],
    },
]);

export default root;
