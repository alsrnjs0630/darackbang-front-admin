// ListComponent.js
import React, {useEffect, useState} from "react";
import '../../pages/product/ProductList.css'; // Add your custom CSS
import {
    Button, Carousel,
} from "@material-tailwind/react";

import {getOne} from "../../api/analyzeApi"

import {API_SERVER_HOST} from "../../api/host";

import useCustomHook from "../hooks/useCustomHook";

import PropTypes from 'prop-types';

const initState = {
    id: null,
    fileName: null,
    createdDate: "",
    updatedDate: ""
};

const ReadComponent = ({id}) => {

    const {moveToList, exceptionHandler} = useCustomHook()

    const [analyze, setAnalyze] = useState(initState);

    useEffect(() => {
        getOne(id).then(data => {
            console.log("이미지 분석 정보:{}", data);
            setAnalyze(data);
        }).catch(error => {
            exceptionHandler(error)
        });

    }, [id])

    return (

        <div className="bg-white p-7 rounded w-9/12 mx-auto">
             <h2 className="text-lg font-semibold mb-4">이미지 분석정보</h2>
            {/* 기본 정보 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 파일명 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">파일명</label>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        {analyze.fileName === null ? "해당정보없음" : analyze.fileName}
                    </div>
                </div>

                <div className="w-full">
                        <Carousel className="rounded-2xl">
                                <img
                                    key={analyze.id}
                                    src={`${API_SERVER_HOST}/admin/analyzes/view/${analyze.fileName}`}
                                    className="w-full aspect-square rounded-2xl object-cover"
                                    alt={analyze.fileName}
                                />
                        </Carousel>
                </div>
            </div>

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
    );
};

//컴포넌트에 전달하는 객체에 대한 정의
ReadComponent.propTypes = {
    id: PropTypes.number.isRequired, // 숫자
};


export default ReadComponent;
