import {Suspense, lazy} from "react";
import {createBrowserRouter} from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";

const Loading = <div>Loading...</div> // 로딩 문구
const ProductList = lazy(() => import("../pages/product/list")) // 일단 메인페이지로 상품관리 페이지 설정
const MemberList = lazy(() => import("../pages/member/list"))

const root = createBrowserRouter([ // 각 페이지 경로에 맞는 컴포넌트를 렌더링할 수 있도록 함.
    {
        path: "/",
        element: <Suspense fallback={Loading}><BasicLayout /></Suspense>,
        children: [
            {
                path: "/member/list",
                element: <Suspense fallback={Loading}><MemberList /></Suspense>
            },
            {
                path: "/product/list",
                element: <Suspense fallback={Loading}><ProductList /></Suspense>
            }
        ]
    }

]);

export default root;
