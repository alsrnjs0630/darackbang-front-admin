import {useState} from "react";
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";
import {useSelector} from "react-redux";

const getNum = (param, defaultValue) => {
    if (!param) {
        return defaultValue;
    }
    return parseInt(param);
}

const useCustomHook = () => {

    const navigate = useNavigate()

    const [refresh, setRefresh] = useState(false)

    const [queryParams] = useSearchParams()

    const page = getNum(queryParams.get("page"), 0)

    const size = getNum(queryParams.get("size"), 10)

    const queryDefault = createSearchParams({page, size}).toString()

    const loginState = useSelector(state => state.loginSlice)

    const moveToList = (pageParam) => {
        let queryStr = ""

        if (pageParam) {
            //springboot 페이지 0 부터 시작함
            const pageNum = getNum(pageParam.page, page)
            const sizeNum = getNum(pageParam.size, size)
            queryStr = createSearchParams({page: pageNum, size: sizeNum}).toString()

        } else {
            queryStr = queryDefault
        }

        navigate({
            pathname: `../list`,
            search: queryStr
        })

        setRefresh(!refresh)
    }

    const moveToRead = (num) => {
        console.log(queryParams)
        console.log("아이디------------>",num)
        navigate({
            pathname: `../read/${num}`,
            search: queryDefault
        })
    }

    const moveToCreate = () => {
        navigate({
            pathname: `../create`,
        })
    }

    //----------------페이지 이동
    const moveToPath = (path) => {
        navigate({pathname: path}, {replace: true})
    }

    const exceptionHandler = (exception) => {

        console.log("에러 정보: {}", exception)

        const httpStatusCode = exception.response != null ? exception.response.status : exception.code; // 서버에서 반환된 HTTP 상태 코드
        const errorMsg = exception.response != null ? exception.response.data.error : exception.message;
        const errorStr = createSearchParams({error: errorMsg}).toString();

        //나머지 에러 처리 페이지로 이동
        navigate("/error", {state: {errorMessage: errorStr, errorCode: httpStatusCode}});

    }


    return {loginState,moveToPath,exceptionHandler, moveToList, moveToRead,moveToCreate, page, size, refresh}
}

export default useCustomHook
