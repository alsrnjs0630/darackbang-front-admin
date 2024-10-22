import {useEffect, useState} from "react";
import {getList} from "../../api/paymentApi";
import PageComponent from "../common/PageComponent";
import useCustomHook from "../hooks/useCustomHook";

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

    const {page, size, refresh, moveToList, moveToRead,exceptionHandler} = useCustomHook()

    const [serverData, setServerData] = useState(initState)

    // State to track which search field (productName or salePrice) is selected
    const [searchType, setSearchType] = useState("userEmail"); // Default to productName
    const [searchValue, setSearchValue] = useState(""); // Value entered in the input field


    useEffect(() => {
        const params = {
            page,
            size,
            buyerName: searchType === "buyerName" ? searchValue : null,
            pgProvider: searchType === "pgProvider" ? searchValue : null,
            paidAmount: searchType === "paidAmount" ? searchValue : null,
            success: searchType === "success" ? searchValue : null,
        };

        getList(params).then(data => {
            setServerData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            exceptionHandler(error)
        });
    }, [page, size, refresh, searchValue, searchType]);


    const handleSearch = () => {
        const params = {
            page,
            size,
            buyerName: searchType === "buyerName" ? searchValue : null,
            pgProvider: searchType === "pgProvider" ? searchValue : null,
            paidAmount: searchType === "paidAmount" ? searchValue : null,
            success: searchType === "success" ? searchValue : null,
        };

        // Call getList API when the search button is clicked
        getList(params).then(data => {
            setServerData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            exceptionHandler(error)
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
                        <option value="buyerName">구매자명</option>
                        <option value="pgProvider">결제수단</option>
                        <option value="paidAmount">구매액</option>
                        <option value="success">결제성공여부</option>
                    </select>

                    {/* Input field that changes based on selected search type */}
                    {searchType === "buyerName" || searchType === "paidAmount" ? (
                        <input
                            type="text"
                            placeholder={`${searchType === "paidAmount" ? "구매자명" : "구매액"}`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                    ) : searchType === "success" ? (
                        <select
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">선택</option>
                            <option value="true">성공</option>
                            <option value="false">실패</option>
                        </select>
                    ) : searchType === "pgProvider" ? (
                        <select
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">선택</option>
                            <option value="kakaopay">카카오</option>
                            <option value="tosspay">토스</option>
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


            {/* Header 부분 */}
            <div className="p-4 bg-blue-500 text-white">
                <div className="grid grid-cols-8 gap-4 font-bold">
                    <span>번호</span>
                    <span>구매자성명</span>
                    <span>구매액</span>
                    <span>결제사</span>
                    <span>결제일</span>
                    <span>성공유무</span>
                    <span>생성일</span>
                    <span>수정일</span>
                </div>
            </div>

            {/* Product 리스트 부분 */}
            {
                serverData.contents.map((payment) => (
                    <div
                        key={payment.id}
                        className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                        onClick={() => moveToRead(payment.id)}
                    >
                        <div className="grid grid-cols-8 gap-4 text-sm">
                            <span>{payment.id}</span>
                            <span>{payment.buyerName}</span>
                            <span>{payment.paidAmount}</span>
                            <span>{payment.pgProvider}</span>
                            <span>{formatDate(payment.paidAt)}</span>
                            <span>{payment.success}</span>
                            <span>{formatDate(payment.createdDate)}</span>
                            <span>{formatDate(payment.updatedDate)}</span>
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