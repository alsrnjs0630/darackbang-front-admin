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

    const [lastError, setLastError] = useState(null); // 마지막 에러 정보를 저장하는 상태


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

        // 이전에 처리한 에러와 동일한 에러인지 확인
        if (lastError && lastError.code === httpStatusCode && lastError.message === errorMsg) {
            return; // 동일한 에러라면 추가 처리하지 않음
        }

        // 다른 에러가 발생하면 상태를 초기화
        if (lastError && (lastError.code !== httpStatusCode || lastError.message !== errorMsg)) {
            setLastError(null); // 상태 초기화
        }

        const errorStr = createSearchParams({error: errorMsg}).toString();

        //나머지 에러 처리 페이지로 이동
        navigate("/error", {state: {errorMessage: errorStr, errorCode: httpStatusCode}});

        // 처리한 에러 정보를 저장
        setLastError({ code: httpStatusCode, message: errorMsg });
    }


    return {loginState,moveToPath,exceptionHandler, moveToList, moveToRead,moveToCreate, page, size, refresh}
}

export default useCustomHook
