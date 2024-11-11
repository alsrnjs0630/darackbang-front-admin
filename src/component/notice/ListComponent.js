import {useEffect, useState} from "react";
import useCustomHook from "../hooks/useCustomHook";
import {getList} from "../../api/eventApi";
import PageComponent from "../common/PageComponent";

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
    const {page, size, refresh, moveToList, moveToRead, moveToCreate, exceptionHandler} = useCustomHook();

    const [serverData, setServerData] = useState(initState);

    // 선택된 검색 필드 (제목 또는 내용)를 추적하는 상태
    const [searchType, setSearchType] = useState("title"); // 기본값은 제목
    const [searchValue, setSearchValue] = useState(""); // 입력 필드에 입력된 값
    const [eventState, setEventState] = useState(""); // 이벤트 상태를 위한 새 상태

    useEffect(() => {
        const params = {
            page,
            size,
            title: searchType === "title" ? searchValue : null,
            content: searchType === "content" ? searchValue : null,
            eventState: eventState, // 새로운 eventState 상태 사용
        };

        getList(params).then(data => {
            console.log("데이터:{}", data);
            setServerData(data);
        }).catch(error => {
            exceptionHandler(error);
        });
    }, [page, size, refresh, searchValue, searchType]);

    const handleSearch = () => {
        const params = {
            page,
            size,
            title: searchType === "title" ? searchValue : null,
            content: searchType === "content" ? searchValue : null,
            eventState: eventState, // 새로운 eventState 상태 사용
        };

        // 검색 버튼 클릭 시 getList API 호출
        getList(params).then(data => {
            setServerData(data);
            console.log("검색 결과:", data); // 데이터 콘솔에 출력
        }).catch(error => {
            exceptionHandler(error);
        });
    };

    const formatDate = (date) => new Date(date).toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    return (
        <div className={'border-2 border-blue-100 mt-10 mr-2 ml-2'}>
            <div className="flex justify-between items-center w-full p-4">
                {/* 왼쪽: 검색 섹션 */}
                <div className="flex space-x-4">
                    {/* 검색 타입 선택을 위한 드롭다운 */}
                    <select
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                            setSearchValue(""); // 타입 전환 시 입력 필드 초기화
                        }}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                    </select>

                    {/* 선택된 검색 타입에 따라 변화하는 입력 필드 */}
                    <input
                        type="text"
                        placeholder={searchType === "title" ? "제목 입력" : "내용 입력"}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />

                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        검색
                    </button>
                </div>

                {/* 오른쪽: 생성 버튼 */}
                <div>
                    <button
                        onClick={moveToCreate}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        공지사항 등록
                    </button>
                </div>
            </div>

            {/* 테이블 컬럼 */}
            <div className="p-4 bg-blue-500 text-white">
                <div className="grid grid-cols-5 gap-4 font-bold">
                    <span>공지사항 ID</span>
                    <span>제목</span>
                    <span>내용</span>
                    <span>등록일</span>
                    <span>수정일</span>
                </div>
            </div>

            {/* 공지사항 리스트 */}

            {/* 페이지네이션 컴포넌트 */}
            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
        </div>
    );
}

export default ListComponent;
