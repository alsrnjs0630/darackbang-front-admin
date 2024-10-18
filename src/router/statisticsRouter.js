import {Suspense, lazy} from "react";

const Loading = () => <div>Loading...</div>;

const Statistics = lazy(() => import("../pages/statistic/StatisticPage"))

const statisticsRouter = () => {
    return [
        {
            path: "all",
            element: <Suspense fallback={<Loading/>}><Statistics/></Suspense>
        },
    ]
}

export default statisticsRouter;