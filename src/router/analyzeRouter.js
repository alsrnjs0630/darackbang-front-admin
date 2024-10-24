import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = () => <div>Loading...</div>;

const AnalyzesList = lazy(() => import("../pages/analyze/ListPage"))
const AnalyzesRead = lazy(() => import("../pages/analyze/ReadPage"))

const analyzeRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={<Loading />}><AnalyzesList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:id",
            element: <Suspense fallback={<Loading />}><AnalyzesRead/></Suspense>
        }
    ]
}

export default analyzeRouter;