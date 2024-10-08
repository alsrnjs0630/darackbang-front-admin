// ListComponent.js
import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import '../../pages/product/ProductList.css'; // Add your custom CSS
import {Input, Button, Textarea, Select, Option} from "@material-tailwind/react";
import {getOne} from "../../api/memberApi"

import { useDaumPostcodePopup } from 'react-daum-postcode';

import {API_SERVER_HOST} from "../../api/host";

import axios from "axios";
import useCustomMove from "../hooks/useCustomMove";


const initState = {
    id: "",
    userEmail: "",
    password: "",
    name: "",
    birthday: "",
    ageGroup: "",
    gender: "",
    mobileNo: "",
    phoneNo: true,
    address: "",
    postNo: "",
    shippingAddr: "",
    shipPostNo: "",
    addShippingAddr: "",
    addPostNo: "",
    mileage: 0,
    isDeleted: false,
    isBlacklist: false,
    memberState: "",
    createdDate: "",
    updatedDate: "",
}


const ReadComponent = ({id}) => {

    console.log("아이티::::::::::{}", id)


    const {page, size, refresh, moveToList, moveToRead, moveToCreate} = useCustomMove()

    const [member, setMember] = useState(initState);

    const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(scriptUrl);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        // 도로명 주소인 경우 추가 주소를 처리
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        // 주소와 우편번호 상태 업데이트
        setMember((prevState) => ({
            ...prevState,
            address: fullAddress,         // 선택된 주소
            postNo: data.zonecode         // 선택된 우편번호
        }));

        console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    };


    const handleShippingComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        // 도로명 주소인 경우 추가 주소를 처리
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        // 주소와 우편번호 상태 업데이트
        setMember((prevState) => ({
            ...prevState,
            shippingAddr: fullAddress,         // 선택된 주소
            shipPostNo: data.zonecode         // 선택된 우편번호
        }));

        console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    };



    const handleAddShippingComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        // 도로명 주소인 경우 추가 주소를 처리
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        // 주소와 우편번호 상태 업데이트
        setMember((prevState) => ({
            ...prevState,
            addShippingAddr: fullAddress,         // 선택된 주소
            addPostNo: data.zonecode         // 선택된 우편번호
        }));

        console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    };


    const handleSearch = () => {
        console.log("오픈")
        open({onComplete: handleComplete});
    }


    const handleSearch2 = () => {
        console.log("오픈")
        open({onComplete: handleShippingComplete});
    };


    const handleSearch3 = () => {
        console.log("오픈")
        open({onComplete: handleAddShippingComplete});
    };

    useEffect(() => {
        getOne(id).then(data => {
            console.log(data);

            setMember(data);

        })

    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();


        Object.keys(member).forEach((key) => {
            // Exclude specific keys
            if (!['createdDate', 'updatedDate'].includes(key)) {
                formData.append(key, member[key]);
            }
        });

        try {
            const response = await axios.put(`${API_SERVER_HOST}/admin/members`, formData, {
                headers: {},
            }).then(res => {
                console.log(res.data)
                const result = res.data.RESULT;
                if (result === "SUCCESS") {
                    alert("Operation was successful!");
                    moveToList()
                } else {
                    alert("Operation failed.");
                }
            });

            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error uploading product:", error);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setMember({
            ...member,
            [name]: value
        });
    }
    // Function to handle delete
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await axios.delete(`${API_SERVER_HOST}/admin/members/${id}`);
                if (response.data.RESULT === "SUCCESS") {
                    alert("Product deleted successfully!");
                    moveToList(); // Navigate back to the list after deletion
                } else {
                    alert("Failed to delete the product.");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("An error occurred while deleting the product.");
            }
        }
    };


    // Function to handle delete
    const handleActive = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await axios.put(`${API_SERVER_HOST}/admin/members/active/${id}`);
                if (response.data.RESULT === "SUCCESS") {
                    alert("상품 활성화 성공!");
                    moveToList(); // Navigate back to the list after deletion
                } else {
                    alert("상품 활성화 실패");
                }
            } catch (error) {
                console.error("상품 활성화 실패:", error);
                alert("상품 활성화 실패");
            }
        }
    };

    function formatBirthday(dateString) {
        // Extract year, month, and day from date string
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        // Return formatted date
        return `${year}-${month}-${day}`;
    }



    return (
        <div className="bg-white p-7 rounded w-9/12 mx-auto">
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="hidden"
                        name="id"
                        className="w-full px-3 py-2 border rounded"
                        value={member.id}
                    />
                </div>

                {/* 그리드 레이아웃 적용 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 회원 로그인 ID */}
                    <div className="mb-3">
                        <Input
                            label="회원로그인ID"
                            name="userEmail"
                            value={member.userEmail}
                            required
                            disabled={true}
                        />
                    </div>
                    {/* 패스워드 */}
                    <div className="mb-3">
                        <Input
                            label="패스워드"
                            name="password"
                            value={member.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* 이름 */}
                    <div className="mb-3">
                        <Input
                            label="이름"
                            name="name"
                            value={member.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* 생년월일 */}
                    <div className="mb-3">
                        <Input
                            label="생년월일"
                            name="birthday"
                            type={"date"}
                            value={formatBirthday(member.birthday)}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* 성별 */}
                    <div className="mb-4">
                        <Select
                            label="성별"
                            value={member.gender ? "F" : "M"}
                            onChange={(e) => setMember({...member, gender: e === "F"})}
                        >
                            <Option value="M">남자</Option>
                            <Option value="F">여자</Option>
                        </Select>
                    </div>
                    {/* 휴대폰번호 */}
                    <div className="mb-4">
                        <Input
                            label="휴대폰번호"
                            name="mobileNo"
                            value={member.mobileNo}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* 전화번호 */}
                    <div className="mb-4">
                        <Input
                            label="전화번호"
                            name="phoneNo"
                            value={member.phoneNo}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* 마일리지 */}
                    <div className="mb-4">
                        <Input
                            label="마일리지"
                            name="mileage"
                            type="number"
                            value={member.mileage}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* 블랙컨슈머 여부 */}
                    <div className="mb-4">
                        <Select
                            label="블랙컨슈머 유무"
                            value={member.isBlacklist ? "true" : "false"}
                            onChange={(e) => setMember({...member, isBlacklist: e === "true"})}
                        >
                            <Option value="true">예</Option>
                            <Option value="false">아니오</Option>
                        </Select>
                    </div>
                    {/* 회원 상태 */}
                    <div className="mb-4">
                        <Select
                            label="회원상태"
                            value={member.memberState}
                            onChange={(e) => setMember({...member, memberState: e})}
                        >
                            <Option value="01">활동중</Option>
                            <Option value="02">탈퇴</Option>
                            <Option value="03">탈퇴신청</Option>
                        </Select>
                    </div>
                    {/* 기본 주소 */}
                    <div className="mb-4 md:col-span-3">
                        <div className="flex space-x-4">
                            <div className="flex-1 mb-3">
                                <Input
                                    label="주소"
                                    name="address"
                                    value={member.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex-1 mb-3">
                                <Input
                                    label="우편번호"
                                    name="postNo"
                                    value={member.postNo}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex-1 mb-3">
                                <Button
                                    type="button"
                                    className="px-6 py-3 bg-blue-500 text-white rounded"
                                    onClick={handleSearch}
                                >
                                    검색
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* 추가 주소 */}
                    <div className="mb-4 md:col-span-3">
                        <div className="flex space-x-4">
                            <div className="flex-1 mb-3">
                                <Input
                                    label="배송주소"
                                    name="shippingAddr"
                                    value={member.shippingAddr}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex-1 mb-3">
                                <Input
                                    label="배송 우편번호"
                                    name="shipPostNo"
                                    value={member.shipPostNo}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex-1 mb-3">
                                <Button
                                    type="button"
                                    className="px-6 py-3 bg-blue-500 text-white rounded"
                                    onClick={handleSearch2}
                                >
                                    검색
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* 추가 주소 */}
                    <div className="mb-4 md:col-span-3">
                        <div className="flex space-x-4">
                            <div className="flex-1 mb-3">
                                <Input
                                    label="추가 배송지"
                                    name="addShippingAddr"
                                    value={member.addShippingAddr}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex-1 mb-3">
                                <Input
                                    label="추가 우편번호"
                                    name="addPostNo"
                                    value={member.addPostNo}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex-1 mb-3">
                                <Button
                                    type="button"
                                    className="px-6 py-3 bg-blue-500 text-white rounded"
                                    onClick={handleSearch3}
                                >
                                    검색
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit and Delete buttons */}
                <div className="flex justify-center items-center mt-4 space-x-4">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                        수정
                    </button>

                    <button
                        type="button"
                        className={`px-4 py-2 text-white rounded ${member.isDeleted ? 'bg-green-500' : 'bg-red-500'}`}
                        onClick={() => {
                            if (member.isDeleted) {
                                handleActive(); // Call handleActive if product is deleted
                            } else {
                                handleDelete(); // Call handleDelete if product is not deleted
                            }
                        }}
                    >
                        {member.isDeleted ? '삭제 취소' : '삭제'}
                    </button>
                </div>
            </form>
        </div>

    );
};

export default ReadComponent;
