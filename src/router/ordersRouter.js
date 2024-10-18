import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = () => <div>Loading...</div>;

const OrdersList = lazy(() => import("../pages/order/ListPage"))
const OrdersRead = lazy(() => import("../pages/order/ReadPage"))

const ordersRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={<Loading />}><OrdersList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:id",
            element: <Suspense fallback={<Loading />}><OrdersRead/></Suspense>
        }
    ]
}

export default ordersRouter;