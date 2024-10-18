import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = () => <div>Loading...</div>;

const PaymentsList = lazy(() => import("../pages/payment/ListPage"))
const PaymentsRead = lazy(() => import("../pages/payment/ReadPage"))

const ordersRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={<Loading />}><PaymentsList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:id",
            element: <Suspense fallback={<Loading />}><PaymentsRead/></Suspense>
        }
    ]
}

export default ordersRouter;