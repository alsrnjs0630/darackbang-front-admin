// ListPage.js
import React from "react";
import ReadComponent from "../../component/member/ReadComponent";
import {useParams} from "react-router-dom";

const ReadPage = () => {

    const {id} = useParams()

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-4">다락방 사용자 상세 정보</h1>
            <ReadComponent id={id} />
        </div>
    );
};

export default ReadPage;