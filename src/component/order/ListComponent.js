import {useEffect, useState} from "react";
import useCustomMove from "../hooks/useCustomMove";
import {getList} from "../../api/orderApi";
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

    const {page, size, refresh, moveToList, moveToRead, moveToCreate} = useCustomMove()

    const [serverData, setServerData] = useState(initState)

    // State to track which search field (productName or salePrice) is selected
    const [searchType, setSearchType] = useState("userEmail"); // Default to productName
    const [searchValue, setSearchValue] = useState(""); // Value entered in the input field


    useEffect(() => {
        const params = {
            page,
            size,
            totalOrderPrice: searchType === "totalOrderPrice" ? searchValue : null,
            userEmail: searchType === "userEmail" ? searchValue : null,
            name: searchType === "name" ? searchValue : null,
        };

        getList(params).then(data => {
            setServerData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            exceptionHandle(error)
        });

    }, [page, size, refresh, searchValue, searchType]);


    const handleSearch = () => {
        const params = {
            page,
            size,
            totalOrderPrice: searchType === "totalOrderPrice" ? searchValue : null,
            userEmail: searchType === "userEmail" ? searchValue : null,
            name: searchType === "name" ? searchValue : null,
        };

        // Call getList API when the search button is clicked
        getList(params).then(data => {
            setServerData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            exceptionHandle(error)
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
                        <option value="totalOrderPrice">총구매액</option>
                        <option value="userEmail">로그인아이디</option>
                        <option value="name">구매자명</option>
                    </select>

                    {/* Input field that changes based on selected search type */}
                    {searchType === "totalOrderPrice" || searchType === "userEmail"|| searchType === "name" ? (
                        <input
                            type="text"
                            placeholder={`${searchType === "totalOrderPrice" ? "구매액" : searchType === "name" ? "로그인아이디" : "구매자명"}`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                    ):null}

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
                <div className="grid grid-cols-7 gap-4 font-bold">
                    <span>주문번호</span>
                    <span>총구매액</span>
                    <span>주문일</span>
                    <span>회원로그인아이디</span>
                    <span>구매자명</span>
                    <span>생성일</span>
                    <span>수정일</span>
                </div>
            </div>

            {/* Product 리스트 부분 */
            }
            {
                serverData.contents.map((order) => (
                    <div
                        key={order.id}
                        className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                        onClick={() => moveToRead(order.id)}
                    >
                        <div className="grid grid-cols-7 gap-4">
                            <span>{order.id}</span>
                            <span>{order.totalOrderPrice}</span>
                            <span>{order.orderDate}</span>
                            <span>{order.member.userEmail}</span>
                            <span>{order.member.name}</span>
                            <span>{formatDate(order.createdDate)}</span>
                            <span>{formatDate(order.updatedDate)}</span>
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