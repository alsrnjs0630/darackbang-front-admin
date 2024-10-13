import React, { useEffect, useState } from "react";
import {
    Input,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import {
    blacklistMember,
    getOne,
    reactivateMember,
    removeBlacklistMember,
    updateMember,
    withdrawMember
} from "../../api/memberApi";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import useCustomMove from "../hooks/useCustomMove";
import useCustomLogin from "../hooks/useCustomLogin";

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
};

const ReadComponent = ({ id }) => {

    const {exceptionHandle} = useCustomLogin()

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null); // Action for confirm modals
    const [member, setMember] = useState(initState);
    const { moveToList } = useCustomMove();
    const open = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');

    const handleModalOpen = (message, confirmAction = null) => {
        setModalMessage(message);
        setModalOpen(true);
        setConfirmAction(() => confirmAction); // Set confirm action for modals requiring confirmation
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setConfirmAction(null); // Reset confirm action
    };

    useEffect(() => {
        getOne(id)
            .then(data => setMember(data))
            .catch(error => {
                exceptionHandle(error)
            });
    }, [id]);

    // handleInputChange 함수 추가
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMember({
            ...member,
            [name]: value
        });
    };

    // handleSearch 함수 추가 (주소 검색)
    const handleSearch = () => {
        open({
            onComplete: (data) => {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') extraAddress += data.bname;
                    if (data.buildingName !== '') extraAddress += `, ${data.buildingName}`;
                    fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
                }

                setMember((prevState) => ({
                    ...prevState,
                    address: fullAddress, // 선택된 주소
                    postNo: data.zonecode  // 선택된 우편번호
                }));
            }
        });
    };

    // handleSearch2 함수 추가 (배송지 주소 검색)
    const handleSearch2 = () => {
        open({
            onComplete: (data) => {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') extraAddress += data.bname;
                    if (data.buildingName !== '') extraAddress += `, ${data.buildingName}`;
                    fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
                }

                setMember((prevState) => ({
                    ...prevState,
                    shippingAddr: fullAddress, // 선택된 배송 주소
                    shipPostNo: data.zonecode  // 선택된 배송 우편번호
                }));
            }
        });
    };

    // handleSearch3 함수 추가 (추가 배송지 주소 검색)
    const handleSearch3 = () => {
        open({
            onComplete: (data) => {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') extraAddress += data.bname;
                    if (data.buildingName !== '') extraAddress += `, ${data.buildingName}`;
                    fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
                }

                setMember((prevState) => ({
                    ...prevState,
                    addShippingAddr: fullAddress, // 선택된 추가 배송 주소
                    addPostNo: data.zonecode  // 선택된 추가 배송 우편번호
                }));
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        updateMember(member)
            .then(result => {
                if (result.RESULT === "SUCCESS") {
                    handleModalOpen("사용자 정보 수정에 성공하였습니다.", moveToList);
                } else {
                    handleModalOpen("사용자 정보 수정에 실패하였습니다.");
                }
            })
            .catch(error => {
                exceptionHandle(error)
            });

    };

    const handleWithdraw = async () => {
        const withdrawAction = async () => {

            withdrawMember(id)
                .then(result => {
                    if (result.RESULT === "SUCCESS") {
                        handleModalOpen("사용자 탈퇴 처리에 성공하였습니다.", moveToList);
                    } else {
                        handleModalOpen("사용자 탈퇴 처리에 실패하였습니다.");
                    }
                })
                .catch(error => {
                    exceptionHandle(error)
                });
        };
        handleModalOpen("사용자를 탈퇴 처리 하시겠습니까?", withdrawAction);
    };

    const handleBlackList = async () => {
        const blacklistAction = async () => {
            blacklistMember(id)
                .then(result => {
                    if (result.RESULT === "SUCCESS") {
                        handleModalOpen("사용자를 블랙컨슈머 지정에 성공하였습니다.", moveToList);
                    } else {
                        handleModalOpen("사용자를 블랙컨슈머 지정에 실패하였습니다.");
                    }
                })
                .catch(error => {
                    exceptionHandle(error)
                });
        };
        handleModalOpen("사용자를 블랙컨슈머로 지정하시겠습니까?", blacklistAction);
    };

    const handleDeBlackList = async () => {
        const deBlacklistAction = async () => {
            removeBlacklistMember(id)
                .then(result => {
                    if (result.RESULT === "SUCCESS") {
                        handleModalOpen("사용자를 블랙컨슈머 해제에 성공하였습니다.", moveToList);
                    } else {
                        handleModalOpen("사용자를 블랙컨슈머 해제에 실패하였습니다.");
                    }
                })
                .catch(error => {
                    exceptionHandle(error)
                });
        };
        handleModalOpen("사용자를 블랙컨슈머에서 해제하시겠습니까?", deBlacklistAction);
    };

    const handleActive = async () => {
        const activateAction = async () => {
            reactivateMember(id)
                .then(result => {
                    if (result.RESULT === "SUCCESS") {
                        handleModalOpen("사용자 삭제 복구에 성공했습니다.", moveToList);
                    } else {
                        handleModalOpen("같은 이메일의 사용자가 이미 존재 합니다.");
                    }
                })
                .catch(error => {
                    exceptionHandle(error)
                });
        };
        handleModalOpen("삭제처리한 사용자를 복구 하시겠습니까?", activateAction);
    };

    const executeConfirmAction = () => {
        if (confirmAction) {
            confirmAction(); // Execute the confirm action
        }
        handleModalClose(); // Close modal after execution
    };

    function formatBirthday(dateString) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${year}-${month}-${day}`;
    }

    return (
        <>
            {/* 모달 팝업 */}
            <Dialog open={modalOpen} handler={handleModalClose}>
                <DialogHeader>알림</DialogHeader>
                <DialogBody>{modalMessage}</DialogBody>
                <DialogFooter>
                    {confirmAction ? (
                        <>
                            <Button color="red" onClick={handleModalClose} className="mr-2">취소</Button>
                            <Button color="blue" onClick={executeConfirmAction} className="ml-2">확인</Button>
                        </>
                    ) : (
                        <Button color="blue" onClick={handleModalClose}>확인</Button>
                    )}
                </DialogFooter>
            </Dialog>

            <div className="bg-white p-7 rounded w-9/12 mx-auto">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-semibold mb-4">사용자 기본 정보</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">회원로그인ID</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.userEmail}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">이름</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">생년월일</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {formatBirthday(member.birthday)}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">성별</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.gender === 'M' ? '남자' : '여자'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">휴대폰번호</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.mobileNo}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">전화번호</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.phoneNo === null ? '정보 없음' : member.phoneNo}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">마일리지</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                {member.mileage}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">블랙컨슈머 유무</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-red-100">
                                {member.isBlacklist === true ? '예' : '아니오'}
                            </div>
                        </div>
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
                    <div className="my-6 border-t border-gray-300"></div>
                    <h2 className="text-lg font-semibold mb-4">사용자 주소 정보</h2>
                    <div className="flex space-x-4 items-end mb-4">
                        <div className="flex-1">
                            <Input label="주소" name="address" value={member.address} onChange={handleInputChange} />
                        </div>
                        <div className="w-1/4">
                            <Input label="우편번호" name="postNo" value={member.postNo} readOnly />
                        </div>
                        <div className="w-1/5">
                            <Button className="w-full bg-blue-600 text-white" onClick={handleSearch}>검색</Button>
                        </div>
                    </div>
                    <div className="flex space-x-4 items-end mb-4">
                        <div className="flex-1">
                            <Input label="배송주소" name="shippingAddr" value={member.shippingAddr} onChange={handleInputChange} />
                        </div>
                        <div className="w-1/4">
                            <Input label="배송 우편번호" name="shipPostNo" value={member.shipPostNo} onChange={handleInputChange} />
                        </div>
                        <div className="w-1/5">
                            <Button className="w-full bg-blue-600 text-white" onClick={handleSearch2}>검색</Button>
                        </div>
                    </div>
                    <div className="flex space-x-4 items-end">
                        <div className="flex-1">
                            <Input label="추가 배송지" name="addShippingAddr" value={member.addShippingAddr} onChange={handleInputChange} />
                        </div>
                        <div className="w-1/4">
                            <Input label="추가 우편번호" name="addPostNo" value={member.addPostNo} onChange={handleInputChange} />
                        </div>
                        <div className="w-1/5">
                            <Button className="w-full bg-blue-600 text-white" onClick={handleSearch3}>검색</Button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-8 space-x-6">
                        <Button type="submit" className="w-full text-white rounded bg-blue-500" onClick={handleSubmit}>수정</Button>
                        {member.isBlacklist ? (
                            <Button className="w-full text-white rounded bg-red-500" onClick={handleDeBlackList}>블랙컨슈머 해제</Button>
                        ) : (
                            <Button className="w-full text-white rounded bg-red-500" onClick={handleBlackList}>블랙컨슈머 지정</Button>
                        )}
                        {member.memberState === '01' ? (
                            <Button className="w-full text-white rounded bg-red-500" onClick={handleWithdraw}>탈퇴처리</Button>
                        ) : (
                            <Button className="w-full text-white rounded bg-green-500" onClick={handleActive}>활성화</Button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default ReadComponent;
