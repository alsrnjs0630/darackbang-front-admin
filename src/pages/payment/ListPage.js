// ListPage.js
import React from "react";
import ListComponent from "../../component/payment/ListComponent";

const ListPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-4">다락방 결제정보</h1>
            <ListComponent />
        </div>
    );
};

export default ListPage;