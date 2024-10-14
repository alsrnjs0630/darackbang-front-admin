import {useDispatch, useSelector} from "react-redux"
import {createSearchParams, useNavigate} from "react-router-dom"
import {logout} from "../../reducer/loginSlice";
import {persistor} from "../../store";
import {useState} from "react";


const useCustomLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [isHandlingError, setIsHandlingError] = useState(false); // 에러 처리 플래그 추가
    //-------로그인 상태
    const loginState = useSelector(state => state.loginSlice)


    //----------------페이지 이동
    const moveToPath = (path) => {
        navigate({pathname: path}, {replace: true})
    }

    const exceptionHandle =(exception) => {

        console.log("exception: {}",exception)

        if (exception.code === 'ERR_NETWORK' && !isHandlingError) { // 중복 호출 방지

            console.log("ERR_NETWORK");

            setIsHandlingError(true); // 에러 처리 중으로 플래그 설정
            dispatch(logout()); // Redux에서 로그아웃 처리
            // 진행 중인 persist 작업을 flush
            persistor.flush().then(() => {
                // redux-persist에서 유지된 상태를 purge
                persistor.purge();
                // 필요시 로컬스토리지에서 상태 삭제
                localStorage.removeItem('persist:root');

                // 리다이렉트 처리
                navigate({ pathname: '/' });
            }).finally(() => {
                setIsHandlingError(false); // 에러 처리 완료 후 플래그 해제
            });

        } else {

            console.log("errorMsg: {}",exception.response.data.error)

            const errorMsg = exception.response.data.error;

            const errorStr = createSearchParams({ error: errorMsg }).toString();

            if (errorMsg === 'REQUIRE_LOGIN') {
                dispatch(logout()); // Redux에서 로그아웃 처리
                // 진행 중인 persist 작업을 먼저 flush
                persistor.flush();
                // redux-persist에서 유지된 상태를 purge
                persistor.purge();
                // localStorage에서 유지된 상태를 삭제
                localStorage.removeItem('persist:root'); // 필요시 키를 조정
                alert("로그인 해야만 합니다.");
                navigate({ pathname: '/', search: errorStr });
                return;
            }

            if (errorMsg === 'ACCESSDENIED') {
                dispatch(logout()); // Redux에서 로그아웃 처리
                // 진행 중인 persist 작업을 먼저 flush
                persistor.flush();
                // redux-persist에서 유지된 상태를 purge
                persistor.purge();
                // localStorage에서 유지된 상태를 삭제
                localStorage.removeItem('persist:root'); // 필요시 키를 조정
                alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.");
                // 메인 페이지로 이동
                navigate({ pathname: '/', search: errorStr });
            }
        }
    }

    return { loginState, moveToPath, exceptionHandle};

}

export default useCustomLogin