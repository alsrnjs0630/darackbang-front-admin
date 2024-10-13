// ListComponent.js
import React, {useEffect, useState} from "react";
import '../../pages/product/ProductList.css'; // Add your custom CSS
import {
    Input,
    Button,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";

import {getOne} from "../../api/orderApi"

import useCustomMove from "../hooks/useCustomMove";
import useCustomLogin from "../hooks/useCustomLogin";


const initState = {
    id: "",  // Long type
    totalOrderPrice: 0,  // Integer type
    orderDate: "",  // LocalDate, you can use a string (e.g., ISO 8601 format)
    orderItems: [],  // List<OrderItemDTO>
    member: "",  // MemberDTO, can be initialized with default values if needed
    createdDate: "",
    updatedDate: "",
}


const ReadComponent = ({id}) => {

    const {page, size, refresh, moveToList, moveToRead, moveToCreate} = useCustomMove()

    const {exceptionHandle} = useCustomLogin()

    const [order, setOrder] = useState(initState);

    useEffect(() => {
        getOne(id).then(data => {
            console.log(data);
            setOrder(data);
        }).catch(error => {
            exceptionHandle(error)
        });

    }, [id])


    return (
        <>
            <div className="bg-white p-7 rounded w-9/12 mx-auto">

                <h2 className="text-lg font-semibold mb-4">주문 기본 정보</h2>
                {/* 기본 사용자 정보 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 회원 로그인 ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">총 주문금액</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.totalOrderPrice}
                        </div>
                    </div>
                    {/* 이름 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문일</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.orderDate}
                        </div>
                    </div>
                    <div>


                    </div>
                </div>
                {/* 구분선 */}
                <div className="my-6 border-t border-gray-300"></div>
                {/* 문 상품 목록 정보 섹션 */}
                <h2 className="text-lg font-semibold mb-4">주문 사용자 정보</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.name}
                        </div>
                    </div>
                    {/* 성별 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자로그인아아디</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.userEmail}
                        </div>
                    </div>
                    {/* 휴대폰번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">휴대폰번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.mobileNo}
                        </div>
                    </div>
                    {/* 전화번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자성별</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.gender === "F" ? "여자" : "남자"}
                        </div>
                    </div>
                    {/* 마일리지 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">연령대</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.ageGroup}
                        </div>
                    </div>
                    {/* 블랙컨슈머 여부 */}
                    <div>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">배송주소</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.address === null ? "정보없음" : order.member.address}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">우편번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.postNo === null ? "정보없음" : order.member.postNo}
                        </div>
                    </div>

                    <div></div>
                </div>

                {/* 구분선 */}
                <div className="my-6 border-t border-gray-300"></div>
                {/* 문 상품 목록 정보 섹션 */}
                <h2 className="text-lg font-semibold mb-4">주문 상품 목록 정보</h2>
                {/* 주문 상품 목록 */}

                <div className="p-4  bg-blue-500 text-white">
                    <div className="grid grid-cols-4 gap-4">
                        <span>상품번호</span>
                        <span>상품명</span>
                        <span>상품판매가</span>
                        <span>구매수량</span>
                    </div>

                </div>
                {/* Product 리스트 부분 */}
                {order.orderItems.map((orderItem) => (
                    <div key={orderItem.id}
                         className="p-4 hover:bg-gray-100 border-b border-gray-200">
                        <div className="grid grid-cols-4 gap-4">
                            <span>{orderItem.product.pno}</span>
                            <span>{orderItem.product.productName}</span>
                            <span>{`${orderItem.productPrice.toLocaleString()}원`}</span>
                            <span>{`${orderItem.productQuantity}개`}</span>
                        </div>
                    </div>
                ))}

                {/* Submit and Action Buttons */}
                <div className="flex justify-center mt-8 space-x-6">
                    <div className="w-1/5">
                        <Button type="submit" className="w-full text-white rounded bg-blue-500"
                                onClick={moveToList}>
                            리스트로 이동
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReadComponent;
