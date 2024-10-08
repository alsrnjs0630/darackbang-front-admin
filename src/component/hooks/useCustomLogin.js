import {useDispatch, useSelector} from "react-redux"
import {createSearchParams, Navigate, useNavigate} from "react-router-dom"


const useCustomLogin = () => {
    const navigate = useNavigate()

    //-------로그인 상태
    const loginState = useSelector(state => state.loginSlice)


    //----------------페이지 이동
    const moveToPath = (path) => {
        navigate({pathname: path}, {replace: true})
    }


    const exceptionHandle =(exception) => {
        console.log("exception")
        console.log(exception)

        const errorMsg = exception.response.data.error
        const errorStr = createSearchParams({error:errorMsg}).toString()

        if(errorMsg ==='REQUIRE_LOGIN'){
            alert("로그인 해야만 합니다.")
            navigate({pathname: '/',search:errorStr})
            return
        }

        if(exception.response.data.error ==='ERROR_ACCESSDENIED'){
            alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.")
            navigate({pathname: '/',search:errorStr})
        }

    }

    return {loginState,  moveToPath, exceptionHandle}

}

export default useCustomLogin