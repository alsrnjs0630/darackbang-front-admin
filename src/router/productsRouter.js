import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";

const Loading = <div>Loading...</div>

const ProductsList = lazy(() => import("../pages/product/ListPage"))
const ProductsRead = lazy(() => import("../pages/product/ReadPage"))
const ProductsCreate = lazy(() => import("../pages/product/CreatePage"))
//const ProductsModify = lazy(() => import("../pages/products/ModifyPage"))

const productsRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><ProductsList/></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list"/>
        },
        {
            path: "read/:id",
            element: <Suspense fallback={Loading}><ProductsRead/></Suspense>
        },
        {
            path: "create",
            element: <Suspense fallback={Loading}><ProductsCreate/></Suspense>
        },
    ]
}

export default productsRouter;