import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = () => <div>Loading...</div>;

const EventsList = lazy(() => import("../pages/event/ListPage"))
const EventsRead = lazy(() => import("../pages/event/ReadPage"))
const EventsCreate = lazy(() => import("../pages/event/CreatePage"))

const eventRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={<Loading />}><EventsList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:id",
            element: <Suspense fallback={<Loading />}><EventsRead/></Suspense>
        },
        {
            path: "create",
            element: <Suspense fallback={<Loading />}><EventsCreate/></Suspense>
        },
    ]
}

export default eventRouter;