import {lazy, Suspense} from "react";
import {Navigate} from "react-router-dom";

const Loading = () => <div>Loading...</div>;

const NoticeList = lazy(() => import("../pages/notice/Listpage"))
const NoticeRead = lazy(() => import("../pages/notice/ReadPage"))
const NoticeCreate = lazy(() => import("../pages/notice/CreatePage"))

const noticeRouter =() => {
    return[
        {
            path: "list",
            element: <Suspense fallback={<Loading />}><NoticeList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:id",
            element: <Suspense fallback={<Loading />}><NoticeRead/></Suspense>
        },
        {
            path: "create",
            element: <Suspense fallback={<Loading />}><NoticeCreate/></Suspense>
        }
    ]
}

export default noticeRouter;