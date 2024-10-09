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

    const [order, setOrder] = useState(initState);

    useEffect(() => {
        getOne(id).then(data => {
            console.log(data);
            setOrder(data);
        })

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
                    {/* 구분선 */}
                    <div className="my-6 border-t border-gray-300"></div>
                    {/* 문 상품 목록 정보 섹션 */}
                    <h2 className="text-lg font-semibold mb-4">주문 사용자 정보</h2>

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.name}
                        </div>
                    </div>
                    {/* 성별 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.name}
                        </div>
                    </div>
                    {/* 휴대폰번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.name}
                        </div>
                    </div>
                    {/* 전화번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.name}
                        </div>
                    </div>
                    {/* 마일리지 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.name}
                        </div>
                    </div>
                    {/* 블랙컨슈머 여부 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {order.member.name}
                        </div>
                    </div>
                </div>
                {/* 구분선 */}
                <div className="my-6 border-t border-gray-300"></div>
                {/* 문 상품 목록 정보 섹션 */}
                <h2 className="text-lg font-semibold mb-4">주문 상품 목록 정보</h2>
                {/* 주문 상품 목록 */}
                <div className="flex space-x-4 items-end mb-4">

                </div>

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
