import {useEffect, useState} from "react";
import useCustomMove from "../hooks/useCustomMove";
import {getList} from "../../api/productApi";
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
    const [searchType, setSearchType] = useState("productName"); // Default to productName
    const [searchValue, setSearchValue] = useState(""); // Value entered in the input field

    useEffect(() => {
        const params = {
            page,
            size,
            productName: searchType === "productName" ? searchValue : null,
            salePrice: searchType === "salePrice" ? searchValue : null,
        };


        getList(params).then(data => {

            console.log("데이터:{}", data)
            setServerData(data);

        }).catch(error => {
            exceptionHandle(error)
        });

    }, [page, size, refresh, searchValue, searchType]);


    const handleSearch = () => {
        const params = {
            page,
            size,
            component: "product",
            productName: searchType === "productName" ? searchValue : null,
            salePrice: searchType === "salePrice" ? searchValue : null,
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
                        <option value="productName">상품명</option>
                        <option value="salePrice">세일가</option>
                    </select>

                    {/* Input field that changes based on selected search type */}
                    {searchType === "productName" ? (
                        <input
                            type="text"
                            placeholder="상품명 입력"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                    ) : (
                        <input
                            type="number"
                            placeholder="세일가 입력"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                    )}

                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        검색
                    </button>
                </div>

                {/* Right: Create button */}
                <div>
                    <button
                        onClick={moveToCreate}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        상품 등록
                    </button>
                </div>
            </div>


            {/* Header 부분 */}
            <div className="p-4 bg-blue-500 text-white">
                <div className="grid grid-cols-8 gap-4 font-bold">
                    <span>상품번호</span>
                    <span>상품명</span>
                    <span>상품판매가</span>
                    <span>상품세일가</span>
                    <span>카테고리</span>
                    <span>수량</span>
                    <span>생성일</span>
                    <span>수정일</span>
                </div>
            </div>

            {/* Product 리스트 부분 */}
            {serverData.contents.map((product) => (
                <div
                    key={product.id}
                    className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                    onClick={() => moveToRead(product.id)}
                >
                    <div className="grid grid-cols-8 gap-4 text-sm">
                        <span>{product.pno}</span>
                        <span>{product.productName}</span>
                        <span>{`${product.retailPrice.toLocaleString()}원`}</span>
                        <span>{`${product.salePrice.toLocaleString()}원`}</span>
                        <span>
                            {product.category === "L01"
                                ? "잎차"
                                : product.category === "B01"
                                    ? "티백"
                                    : product.category === "F01"
                                        ? "열매"
                                        : product.category}
                            </span>
                        <span>{product.quantity}</span>
                        <span>{formatDate(product.createdDate)}</span>
                        <span>{formatDate(product.updatedDate)}</span>
                    </div>
                </div>
            ))}

            {/* Pagination 컴포넌트 */}
            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
        </div>
    );
}

export default ListComponent;