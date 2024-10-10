import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = <div>Loading...</div>

const StatisticsList = lazy(() => import("../pages/statistic/ListPage"))
const StatisticsRead = lazy(() => import("../pages/statistic/ReadPage"))

//const ProductsModify = lazy(() => import("../pages/products/ModifyPage"))

const ordersRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><StatisticsList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:id",
            element: <Suspense fallback={Loading}><StatisticsRead/></Suspense>
        }
    ]
}

export default ordersRouter;