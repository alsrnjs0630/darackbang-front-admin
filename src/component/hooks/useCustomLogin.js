import {useSelector} from "react-redux"
import {createSearchParams, useNavigate} from "react-router-dom"

const useCustomLogin = () => {

    const navigate = useNavigate()

    const loginState = useSelector(state => state.loginSlice)

    //----------------페이지 이동
    const moveToPath = (path) => {
        navigate({pathname: path}, {replace: true})
    }

    const exceptionHandle = (exception) => {

        console.log("에러 정보: {}", exception)

        const httpStatusCode = exception.response != null ? exception.response.status : exception.code; // 서버에서 반환된 HTTP 상태 코드
        const errorMsg = exception.response != null ? exception.response.data.error : exception.message;
        const errorStr = createSearchParams({error: errorMsg}).toString();

        //나머지 에러 처리 페이지로 이동
        navigate("/error", {state: {errorMessage: errorStr, errorCode: httpStatusCode}});

    }

    return {loginState, moveToPath, exceptionHandle};

}

export default useCustomLogin