import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";
import LoginPage from "../pages/login/LoginPage";
import productsRouter from "./productsRouter";
import membersRouter from "./membersRouter";

const Loading = <div>Loading...</div>; // 로딩 문구

const root = createBrowserRouter([
    {
        path: "/", // Login page route without BasicLayout
        element: <Suspense fallback={Loading}><LoginPage /></Suspense>,
    },
    {
        path: "/dashboard", // Main application after login, with BasicLayout
        element: <Suspense fallback={Loading}><BasicLayout /></Suspense>,
        children: [
            {
                path: "products",
                children: productsRouter(),
            },
            {
                path: "members",
                children: membersRouter(),
            },
        ],
    },
]);

export default root;
