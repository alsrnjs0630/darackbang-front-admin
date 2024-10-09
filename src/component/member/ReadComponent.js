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
import {getOne} from "../../api/memberApi"

import {useDaumPostcodePopup} from 'react-daum-postcode';

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
    phoneNo: "",
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

    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpen = () => setModalOpen(!modalOpen);

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
            await axios.put(`${API_SERVER_HOST}/admin/members`, formData, {
                headers: {},
            }).then(res => {
                console.log(res.data)
                const result = res.data.RESULT;
                if (result === "SUCCESS") {

                    alert("사용자 정보 수정에 성공하였습니다.");

                    //alert("Operation was successful!");
                    moveToList()
                } else {
                    //alert("Operation failed.");
                    alert("사용자 정보 수정에 실패하였습니다.");
                }

                console.log("Response:", res.data);
            });


        } catch (error) {
            console.error("Error uploading product:", error);
            alert("사용자 정보 수정에 실패하였습니다.");
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
    const handleWithdraw = async () => {
        if (window.confirm("사용자를 탈퇴 처리 하시겠습니까?")) {
            try {
                const response = await axios.put(`${API_SERVER_HOST}/admin/members/withdraw/${id}`);
                if (response.data.RESULT === "SUCCESS") {
                    alert("사용자 탈퇴 처리에 성공 하였습니다.");
                    moveToList(); // Navigate back to the list after deletion
                } else {
                    alert("사용자 탈퇴 처리에 실패 하였습니다.");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("사용자 탈퇴 처리에 실패 하였습니다.");
            }
        }
    };
    // Function to handle delete
    const handleBlackList = async () => {
        if (window.confirm("사용자를 블랙컨슈머로 지정하시겠습니까?")) {
            try {
                const response = await axios.put(`${API_SERVER_HOST}/admin/members/blacklist/${id}`);
                if (response.data.RESULT === "SUCCESS") {
                    alert("사용자를 블랙컨슈머 지정에 성공하였습니다.");
                    moveToList(); // Navigate back to the list after deletion
                } else {
                    alert("사용자를 블랙컨슈머 지정에 실패하였습니다.");
                }
            }  catch (error) {
                console.error("사용자를 블랙컨슈머 지정에 실패:", error);
                alert("사용자를 블랙컨슈머 지정에 실패하였습니다.");
            }
        }
    };


    const handleDeBlackList = async () => {
        if (window.confirm("사용자를 블랙컨슈머에서 해제하시겠습니까?")) {
            try {
                const response = await axios.put(`${API_SERVER_HOST}/admin/members/unblacklist/${id}`);
                if (response.data.RESULT === "SUCCESS") {
                    alert("사용자를 블랙컨슈머 해제에 성공하였습니다.");
                    moveToList(); // Navigate back to the list after deletion
                } else {
                    alert("사용자를 블랙컨슈머 해제에 실패하였습니다.");
                }
            }  catch (error) {
                console.error("사용자를 블랙컨슈머 해제에 실패:", error);
                alert("사용자를 블랙컨슈머 해제에 실패하였습니다.");
            }
        }
    };

    // Function to handle delete
    const handleActive = async () => {
        if (window.confirm("삭제처리한 사용자를 복구 하시겠습니까?")) {
            try {
                const response = await axios.put(`${API_SERVER_HOST}/admin/members/active/${id}`);
                if (response.data.RESULT === "SUCCESS") {
                    alert("사용자 삭제 복구에 성공했습니다.");
                    moveToList(); // Navigate back to the list after deletion
                } else {
                    alert("같은 이메일의 사용자가 이미 존재 합니다.");
                }
            } catch (error) {
                console.error("사용자 삭제 복구:", error);
                alert("사용자 삭제 복구에 실패하였습니다.");
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
        <>
            <Dialog open={modalOpen} handler={handleOpen}>
                <DialogHeader>Its a simple modal.</DialogHeader>
                <DialogBody>
                    The key to more success is to have a lot of pillows. Put it this way,
                    it took me twenty five years to get these plants, twenty five years of
                    blood sweat and tears, and I&apos;m never giving up, I&apos;m just
                    getting started. I&apos;m up to something. Fan luv.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

            <div className="bg-white p-7 rounded w-9/12 mx-auto">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-semibold mb-4">사용자 기본 정보</h2>
                    {/* 기본 사용자 정보 섹션 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 회원 로그인 ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">회원로그인ID</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.userEmail}
                            </div>
                        </div>
                        {/* 이름 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">이름</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.name}
                            </div>
                        </div>
                        {/* 생년월일 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">생년월일</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {formatBirthday(member.birthday)}
                            </div>
                        </div>
                        {/* 성별 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">성별</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.gender === 'M' ? '남자' : '여자'}
                            </div>
                        </div>
                        {/* 휴대폰번호 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">휴대폰번호</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.mobileNo}
                            </div>
                        </div>
                        {/* 전화번호 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">전화번호</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.phoneNo === null ? '정보 없음' : member.phoneNo}
                            </div>
                        </div>
                        {/* 마일리지 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">마일리지</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.mileage}
                            </div>
                        </div>
                        {/* 블랙컨슈머 여부 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">블랙컨슈머 유무</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-red-100">
                                {member.isBlacklist === true ? '예' : '아니오'}
                            </div>
                        </div>
                        {/* 회원 상태 */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700">사용자 상태</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-red-100">
                                {
                                    member.memberState === '01'
                                        ? '활동중'
                                        : member.memberState === '02'
                                            ? '탈퇴'
                                            : '탈퇴신청'
                                }
                            </div>
                        </div>
                    </div>
                    {/* 구분선 */}
                    <div className="my-6 border-t border-gray-300"></div>
                    {/* 주소 섹션 */}
                    <h2 className="text-lg font-semibold mb-4">사용자 주소 정보</h2>
                    {/* 기본 주소 */}
                    <div className="flex space-x-4 items-end mb-4">
                        <div className="flex-1">
                            <Input label="주소" name="address" value={member.address}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="w-1/4">
                            <Input label="우편번호" name="postNo" value={member.postNo} readOnly/>
                        </div>
                        <div className="w-1/5">
                            <Button className="w-full bg-blue-600 text-white" onClick={handleSearch}>검색</Button>
                        </div>
                    </div>

                    {/* 배송 주소 */}
                    <div className="flex space-x-4 items-end mb-4">
                        <div className="flex-1">
                            <Input label="배송주소" name="shippingAddr" value={member.shippingAddr}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="w-1/4">
                            <Input label="배송 우편번호" name="shipPostNo" value={member.shipPostNo}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="w-1/5">
                            <Button className="w-full bg-blue-600 text-white" onClick={handleSearch2}>검색</Button>
                        </div>
                    </div>

                    {/* 추가 배송 주소 */}
                    <div className="flex space-x-4 items-end">
                        <div className="flex-1">
                            <Input label="추가 배송지" name="addShippingAddr" value={member.addShippingAddr}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="w-1/4">
                            <Input label="추가 우편번호" name="addPostNo" value={member.addPostNo}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="w-1/5">
                            <Button className="w-full bg-blue-600 text-white" onClick={handleSearch3}>검색</Button>
                        </div>
                    </div>
                    {/* Submit and Action Buttons */}
                    <div className="flex justify-center mt-8 space-x-6">
                        <div className="w-1/5">
                            <Button type="submit" className="w-full text-white rounded bg-blue-500"
                                    onClick={handleSubmit}>
                                수정
                            </Button>
                        </div>
                        <div className="w-1/5">
                            {member.isBlacklist === true ? (
                                <Button type="button"
                                        className="w-full text-white rounded bg-red-500"
                                        onClick={handleDeBlackList}>
                                    블랙컨슈머 해제
                                </Button>
                            ) : (
                                <Button type="button"
                                        className="w-full text-white rounded bg-red-500"
                                        onClick={handleBlackList}>
                                    블랙컨슈머 지정
                                </Button>
                            )}
                        </div>
                        <div className="w-1/5">
                            {member.memberState === '01' ? (
                                <Button type="button"
                                        className="w-full text-white rounded bg-red-500"
                                        onClick={handleWithdraw}>
                                    탈퇴처리
                                </Button>
                            ) : member.memberState === '02' ? (
                                <Button type="button"
                                        className="w-full text-white rounded bg-green-500"
                                        onClick={handleActive}>
                                    활성화
                                </Button>
                            ) : (
                                <Button type="button" className="w-full text-white rounded  bg-red-500"
                                        onClick={handleWithdraw}>
                                    탈퇴처리
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ReadComponent;
