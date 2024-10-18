import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = () => <div>Loading...</div>;

const MembersList = lazy(() => import("../pages/member/ListPage"))
const MembersRead = lazy(() => import("../pages/member/ReadPage"))

const membersRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={<Loading />}><MembersList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:id",
            element: <Suspense fallback={<Loading />}><MembersRead/></Suspense>
        },
    ]
}

export default membersRouter;