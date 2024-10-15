import {useEffect, useState} from "react";
import useCustomMove from "../hooks/useCustomMove";
import {getList} from "../../api/memberApi";
import PageComponent from "../common/PageComponent";
import useCustomLogin from "../hooks/useCustomLogin";

const initState = {
    contents: [],
    pageNumbers: [],
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    currentPage: 0,
    search: null
}


const ListComponent = () => {

    const {exceptionHandle} = useCustomLogin()

    const {page, size, refresh, moveToList, moveToRead} = useCustomMove()

    const [serverData, setServerData] = useState(initState)

    // State to track which search field (productName or salePrice) is selected
    const [searchType, setSearchType] = useState("userEmail"); // Default to productName
    const [searchValue, setSearchValue] = useState(""); // Value entered in the input field


    useEffect(() => {
        const params = {
            page,
            size,
            userEmail: searchType === "userEmail" ? searchValue : null,
            name: searchType === "name" ? searchValue : null,
            gender: searchType === "gender" ? searchValue : null,
            phoneNo: searchType === "phoneNo" ? searchValue : null,
            isBlacklist: searchType === "isBlacklist" ? searchValue : null,
            memberState: searchType === "memberState" ? searchValue : null
        };

        getList(params).then(data => {
            setServerData(data);
        }).catch(error => {
            exceptionHandle(error);
        });
    }, [page, size, refresh, searchValue, searchType]);


    const handleSearch = () => {
        const params = {
            page,
            size,
            userEmail: searchType === "userEmail" ? searchValue : null,
            name: searchType === "name" ? searchValue : null,
            gender: searchType === "gender" ? searchValue : null,
            phoneNo: searchType === "phoneNo" ? searchValue : null,
            isBlacklist: searchType === "isBlacklist" ? searchValue : null,
            memberState: searchType === "memberState" ? searchValue : null
        };

        // Call getList API when the search button is clicked
        getList(params).then(data => {
            setServerData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            exceptionHandle(error);
        });
    };

    const formatDate = (date) => new Date(date).toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return (
        <div className={'border-2 border-blue-100 mt-10 mr-2 ml-2'}>
            <div className="flex justify-between items-center w-full p-4">
                {/* Left: Search section */}
                <div className="flex space-x-4">
                    {/* Dropdown to select search type */}
                    <select
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                            setSearchValue(""); // Clear input when switching types
                        }}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="userEmail">사용자이메일</option>
                        <option value="name">이름</option>
                        <option value="gender">성별</option>
                        <option value="phoneNo">핸드폰번호(숫자)</option>
                        <option value="isBlacklist">블랙리스트</option>
                        <option value="memberState">회원상태</option>
                    </select>

                    {/* Input field that changes based on selected search type */}
                    {searchType === "userEmail" || searchType === "name" ? (
                        <input
                            type="text"
                            placeholder={`${searchType === "userEmail" ? "이메일 입력" : searchType === "name" ? "이름 입력" : "성별 입력"}`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                    ) : searchType === "phoneNo" ? (
                        <input
                            type="number"
                            placeholder="핸드폰번호 입력"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                    ) : searchType === "gender" ? (
                        <select
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">선택</option>
                            <option value="M">남자</option>
                            <option value="F">여자</option>
                        </select>
                    ) : searchType === "isBlacklist" ? (
                        <select
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">선택</option>
                            <option value="1">예</option>
                            <option value="0">아니요</option>
                        </select>
                    ) : searchType === "memberState" ? (
                        <select
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">선택</option>
                            <option value="01">활동중</option>
                            <option value="02">탈퇴</option>
                            <option value="03">탈퇴대기</option>
                        </select>
                    ) : null}

                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        검색
                    </button>
                </div>
            </div>


            {/* Header 부분 */
            }
            <div className="p-4 bg-blue-500 text-white">
                <div className="grid grid-cols-8 gap-4 font-bold">
                    <span>회원번호</span>
                    <span>회원아이디</span>
                    <span>회원명</span>
                    <span>성별</span>
                    <span>블랙컨슈머유무</span>
                    <span>회원상태</span>
                    <span>생성일</span>
                    <span>수정일</span>
                </div>
            </div>

            {/* Product 리스트 부분 */
            }
            {
                serverData.contents.map((member) => (
                    <div
                        key={member.id}
                        className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                        onClick={() => moveToRead(member.id)}
                    >
                        <div className="grid grid-cols-8 gap-4 text-sm">
                            <span>{member.id}</span>
                            <span>{member.userEmail}</span>
                            <span>{member.name}</span>
                            <span>{member.gender}</span>
                            <span>{member.isBlacklist === true ? "예" : "아니오"}</span>
                            <span>{member.memberState}</span>
                            <span>{formatDate(member.createdDate)}</span>
                            <span>{formatDate(member.updatedDate)}</span>
                        </div>
                    </div>
                ))
            }

            {/* Pagination 컴포넌트 */
            }
            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
        </div>
    )
        ;
}

export default ListComponent;