// ListComponent.js
import React, {useEffect, useState} from "react";
import '../../pages/product/ProductList.css'; // Add your custom CSS
import {
    Button,
} from "@material-tailwind/react";

import {getOne} from "../../api/paymentApi"

import useCustomHook from "../hooks/useCustomHook";

import PropTypes from 'prop-types';
const initState = {
    id: null,
    applyNum: null,
    bankName: null,
    buyerAddr: "",
    buyerEmail: "",
    buyerName: "",
    buyerPostcode: "",
    buyerTel: "",
    cardName: null,
    cardNumber: null,
    cardQuota: "0",
    currency: "",
    customData: null,
    customerUid: "",
    impUid: "",
    merchantUid: "",
    name: "",
    paidAmount: 0,
    paidAt: "",
    payMethod: "",
    pgProvider: "",
    pgTid: "",
    pgType: "",
    receiptUrl: "",
    expirationDate: "",
    status: "",
    success: "",
    failReason: null,
    order: {
        id: null,
        totalOrderPrice: 0,
        orderDate: "",
        orderItems: [],
        member: {
            id: null,
            userEmail: "",
            password: "",
            name: "",
            birthday: "",
            ageGroup: "",
            gender: "",
            mobileNo: "",
            phoneNo: null,
            address: null,
            postNo: null,
            shippingAddr: null,
            shipPostNo: null,
            addShippingAddr: null,
            addPostNo: null,
            mileage: 0,
            isDeleted: false,
            isBlacklist: false,
            memberState: "",
            createdDate: "",
            updatedDate: ""
        },
        createdDate: "",
        updatedDate: ""
    },
    createdDate: "",
    updatedDate: ""
};

const ReadComponent = ({id}) => {

    const {moveToList,exceptionHandler} = useCustomHook()

    const [payment, setPayment] = useState(initState);

    useEffect(() => {
        getOne(id).then(data => {
            console.log("결제 정보:{}", data);
            setPayment(data);
        }).catch(error => {
            exceptionHandler(error)
        });

    }, [id])


    return (
        <>
            <div className="bg-white p-7 rounded w-9/12 mx-auto">

                <h2 className="text-lg font-semibold mb-4">결제 기본 정보</h2>
                {/* 기본 사용자 정보 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 회원 로그인 ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">신용카드 승인번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.applyNum===null?"해당정보없음":payment.applyNum}
                        </div>
                    </div>
                    {/* 이름 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">가상계좌 은행명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.bankName===null?"해당정보없음":payment.bankName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자 주소</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.buyerAddr===null?"해당정보없음":payment.buyerAddr}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자 이메일</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.buyerEmail===null?"해당정보없음":payment.buyerEmail}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.buyerName===null?"해당정보없음":payment.buyerName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자 우편번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.buyerPostcode===null?"해당정보없음":payment.buyerPostcode}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자 연락처</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.buyerTel===null?"해당정보없음":payment.buyerTel}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">카드명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.cardName===null?"해당정보없음":payment.cardName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">카드 번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.cardNumber===null?"해당정보없음":payment.cardNumber}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">할부 개월수</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.cardQuota===null?"해당정보없음":payment.cardQuota}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">결제통화종류</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.currency===null?"해당정보없음":payment.currency}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">가맹점 임의 지정 데이터</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.customData===null?"해당정보없음":payment.customData}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">회원번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.customerUid===null?"해당정보없음":payment.customerUid}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">IamPort 고유 결제 번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.impUid===null?"해당정보없음":payment.impUid}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.merchantUid===null?"해당정보없음":payment.merchantUid}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">상품명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.name===null?"해당정보없음":payment.name}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">결제금액
                            <span className="text-xs text-gray-500 ml-1">
            (* 3만원이하는 상품결제금액에 배송비 3000원 포함)
        </span>
                        </label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        {payment.paidAmount===null?"해당정보없음":payment.paidAmount}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">결제승인시각</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.paidAt===null?"해당정보없음":payment.paidAt}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">결제수단</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.payMethod===null?"해당정보없음":payment.payMethod}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">PG사</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.pgProvider===null?"해당정보없음":payment.pgProvider}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">PG사거래번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.pgTid===null?"해당정보없음":payment.pgTid}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">결제 타입</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.pgType===null?"해당정보없음":payment.pgType}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">결제상태</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.status===null?"해당정보없음":payment.status}
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">거래 매출전표 URL</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.receiptUrl}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">결제 실패 원인</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.failReason === null ? "정보없음" : payment.failReason}
                        </div>
                    </div>
                </div>

                {/* 구분선 */}
                <div className="my-6 border-t border-gray-300"></div>
                {/* 문 상품 목록 정보 섹션 */}
                <h2 className="text-lg font-semibold mb-4">결제 사용자 정보</h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자명</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.order.member.name}
                        </div>
                    </div>
                    {/* 성별 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자로그인아아디</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.order.member.userEmail}
                        </div>
                    </div>
                    {/* 휴대폰번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">휴대폰번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.order.member.mobileNo}
                        </div>
                    </div>
                    {/* 전화번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">주문자성별</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.order.member.gender === "F" ? "여자" : "남자"}
                        </div>
                    </div>
                    {/* 마일리지 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">연령대</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.order.member.ageGroup}
                        </div>
                    </div>
                    {/* 블랙컨슈머 여부 */}
                    <div>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">배송주소</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.order.member.address === null ? "정보없음" : payment.order.member.address}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">우편번호</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            {payment.order.member.postNo === null ? "정보없음" : payment.order.member.postNo}
                        </div>
                    </div>

                    <div></div>
                </div>

                {/* 구분선 */}
                <div className="my-6 border-t border-gray-300"></div>
                {/* 문 상품 목록 정보 섹션 */}
                <h2 className="text-lg font-semibold mb-4">결제 상품 목록 정보</h2>
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
                {payment.order.orderItems.map((orderItem) => (
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

//컴포넌트에 전달하는 객체에 대한 정의
ReadComponent.propTypes = {
    id: PropTypes.number.isRequired, // 숫자
};


export default ReadComponent;
