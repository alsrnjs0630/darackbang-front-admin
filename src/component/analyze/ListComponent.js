import React, { useEffect, useState } from "react";
import { getList } from "../../api/analyzeApi";
import PageComponent from "../common/PageComponent";
import useCustomHook from "../hooks/useCustomHook";
import { Carousel } from "@material-tailwind/react";
import { API_SERVER_HOST } from "../../api/host";

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
    search: null,
};

const ListComponent = () => {
    const { page, size, refresh, moveToList, moveToRead, exceptionHandler } = useCustomHook();

    const [serverData, setServerData] = useState(initState);
    const [searchType, setSearchType] = useState("fileName");
    const [searchValue, setSearchValue] = useState("");

    // State to handle popup (modal)
    const [selectedImage, setSelectedImage] = useState(null); // To store the selected image

    useEffect(() => {
        const params = {
            page,
            size,
            fileName: searchType === "fileName" ? searchValue : null,
        };

        getList(params).then((data) => {
            setServerData(data);
            console.log("Search results:", data);
        }).catch((error) => {
            exceptionHandler(error);
        });
    }, [page, size, refresh, searchValue, searchType]);

    const handleSearch = () => {
        const params = {
            page,
            size,
            fileName: searchType === "fileName" ? searchValue : null,
        };

        getList(params).then((data) => {
            setServerData(data);
            console.log("Search results:", data);
        }).catch((error) => {
            exceptionHandler(error);
        });
    };

    const formatDate = (date) => new Date(date).toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const openImageModal = (image) => {
        setSelectedImage(image);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className={'border-2 border-blue-100 mt-10 mr-2 ml-2'}>
            <div className="flex justify-between items-center w-full p-4">
                {/* Search section */}
                <div className="flex space-x-4">
                    {/* Dropdown to select search type */}
                    <select
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                            setSearchValue("");
                        }}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="fileName">파일명</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`파일명`}
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
            </div>

            <Carousel
                className="w-full h-auto rounded-2xl" // Full width and auto height
                loop={true}
                prevArrow={({ handlePrev }) => (
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full opacity-80 hover:opacity-100 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                )}
                nextArrow={({ handleNext }) => (
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full opacity-80 hover:opacity-100 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                )}
            >
                {serverData.contents.map((analyze) => (
                    <div
                        key={analyze.id}
                        className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                        onClick={() => openImageModal(analyze)}
                    >
                        <img
                            key={analyze.id}
                            src={`${API_SERVER_HOST}/admin/analyzes/view/${analyze.fileName}`}
                            className="w-screen h-screen rounded-2xl object-contain"
                            alt={analyze.fileName}
                        />
                        <div className="flex justify-between mt-2 space-x-4"> {/* 간격 설정 */}
                            <span>{analyze.fileName}</span>
                            <span>{formatDate(analyze.createdDate)}</span>
                        </div>
                    </div>
                ))}
            </Carousel>


            {/* Modal for viewing image */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                    <div className="relative w-screen h-screen flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 text-white text-5xl font-bold z-50"
                        >
                            &times;
                        </button>
                        {/* Fullscreen Image */}
                        <img
                            src={`${API_SERVER_HOST}/admin/analyzes/view/${selectedImage.fileName}`}
                            alt={selectedImage.fileName}
                            className="w-auto h-auto max-h-full max-w-full rounded-2xl"
                        />
                        <p className="absolute bottom-10 text-white text-center text-lg">
                            {selectedImage.fileName}
                        </p>
                    </div>
                </div>
            )}

            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
        </div>
    );
};

export default ListComponent;
