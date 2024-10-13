import {useDispatch, useSelector} from "react-redux"
import {createSearchParams, useNavigate} from "react-router-dom"
import {logout} from "../../reducer/loginSlice";


const useCustomLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    //-------로그인 상태
    const loginState = useSelector(state => state.loginSlice)


    //----------------페이지 이동
    const moveToPath = (path) => {
        navigate({pathname: path}, {replace: true})
    }


    const exceptionHandle =(exception) => {

        console.log("exception: {}",exception)

        if (exception.code === 'ERR_NETWORK') {
            alert('서버와의 연결에 문제가 발생했습니다. 인터넷 연결을 확인하거나 다시 시도해주세요.');
            dispatch(logout()); // Redux에서 로그아웃 처리
            navigate({ pathname: '/'});
        } else {

            console.log("errorMsg: {}",exception.response.data.error)

            const errorMsg = exception.response.data.error;

            const errorStr = createSearchParams({ error: errorMsg }).toString();

            if (errorMsg === 'REQUIRE_LOGIN') {
                dispatch(logout()); // Redux에서 로그아웃 처리
                alert("로그인 해야만 합니다.");
                navigate({ pathname: '/', search: errorStr });
                return;
            }

            if (errorMsg === 'ACCESSDENIED') {
                dispatch(logout()); // Redux에서 로그아웃 처리
                alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.");
                navigate({ pathname: '/', search: errorStr });
            }
        }
    }

    return { loginState, moveToPath, exceptionHandle};

}

export default useCustomLogin