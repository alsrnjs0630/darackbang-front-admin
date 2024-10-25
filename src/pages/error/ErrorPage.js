import React from "react";
import { useLocation } from "react-router-dom";
import ErrorComponent from "../../component/common/ErrorComponent";

const ErrorPage = () => {
    const location = useLocation();

    const errorMessage = location.state?.errorMessage; // Access error message from state
    const errorCode = location.state?.errorCode;       // 에러 코드

    console.log("에러페이지:",errorCode);
    console.log("에러페이지:",errorMessage);
    const transformedMessage = errorMessage.split('=')[1];

    return (
        <div>
            <ErrorComponent errorMessage={transformedMessage} errorCode={errorCode} />
        </div>
    );
};

export default ErrorPage;
