import React, {useState} from "react";
import {useDropzone} from "react-dropzone";
import '../../pages/product/ProductList.css'; // Add your custom CSS
import {create} from "../../api/eventApi";
import useCustomHook from "../hooks/useCustomHook";
import {Input, Textarea, Select, Option} from "@material-tailwind/react";
import {Dialog, DialogHeader, DialogBody, DialogFooter, Button} from "@material-tailwind/react";

const CreateComponent = () => {
    const [event, setEvent] = useState({
        title: "",
        contents: "",
        eventState: "",
        startDate: "",
        endDate: "",
    });

    const { moveToList, exceptionHandler } = useCustomHook();
    const [files, setFiles] = useState();

    // 모달 상태 관리
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onCloseCallback, setOnCloseCallback] = useState(null); // 모달 닫힐 때 실행할 콜백

    const openModal = (message, callback = null) => {
        setModalMessage(message);
        setModalOpen(true);
        setOnCloseCallback(() => callback); // 콜백을 저장
    };

    const closeModal = () => {
        setModalOpen(false);
        if (onCloseCallback) {
            onCloseCallback(); // 콜백 함수 실행 (있을 경우)
            setOnCloseCallback(null); // 콜백 초기화
        }
    };

    const eventImageFileSize = (size) => {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) + " " + ["B", "kB", "MB", "GB", "TB"][i];
    };

    const removeFile = ( index, event) => {
        event.stopPropagation();

        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);

    };

    const onDrop = (acceptedFiles) => {
        const newFiles = acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        setFiles(newFiles);
    };

    const { getRootProps: getMainDropzoneProps, getInputProps: getMainInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEvent({
            ...event,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 동작(페이지 새로고침 등) 방지

        // 필수 입력 필드 목록 (이름과 레이블을 함께 정의)
        const requiredFields = [
            { name: 'title', label: '제목' },
            { name: 'contents', label: '내용' },
            { name: 'eventState', label: '이벤트 상태' },
            { name: 'startDate', label: '이벤트 시작일' },
            { name: 'endDate', label: '이벤트 마감일' },
        ];

        // 각 필수 필드에 대해 값이 입력되었는지 확인
        for (let field of requiredFields) {
            console.log("event:{}", event); // 디버깅을 위한 로그 출력
            if (!event[field.name]) { // 필드 값이 비어있을 경우
                console.log(field.name); // 디버깅을 위한 필드명 출력
                console.log(field.label); // 디버깅을 위한 레이블 출력
                openModal(`${field.label}을(를) 입력해야 합니다!`);

                // 해당 필드에 포커스 설정
                const inputElement = document.getElementsByName(field.name)[0];
                if (inputElement) {
                    inputElement.focus(); // 유효하지 않은 첫 번째 입력 요소에 포커스 설정
                }
                return; // 유효성 검사가 실패한 경우 폼 제출 중지
            }
        }

        // 이벤트 마감일이 오늘 날짜보다 과거일 수 없음을 검사
        const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 YYYY-MM-DD 형식으로 가져옴
        if (event.endDate < today) {
            openModal("이벤트 마감일은 오늘 날짜보다 과거일 수 없습니다.");
            document.getElementsByName('endDate')[0].focus(); // 제조일자 입력 필드에 포커스 설정
            return; // 제조일자가 미래일 경우 폼 제출 중지
        }

        // 시작일과 마감일 관계 검사 추가
        if (event.startDate > event.endDate) {
            openModal("이벤트 시작일은 마감일 이전이어야 합니다.");
            return;
        }

        // 최소 한 개의 주요 상품 이미지가 업로드되었는지 확인
        if (!files) {
            openModal("이벤트 이미지는 하나 이상 있어야 합니다.!"); // 이미지가 없을 경우 경고 메시지 표시
            return; // 이미지가 없는 경우 폼 제출 중지
        }
        console.log("files : ", files)
        const formData = new FormData();
        Object.keys(event).forEach((key) => {
            formData.append(key, event[key]);
        });

        files.forEach((file) => {
            formData.append("file", file);
            formData.append("fileName", file.name)
        });

        console.log("FormData : ", formData)
        create(formData).then(data => {
            if (data.RESULT === "SUCCESS") {
                // RESULT가 "SUCCESS"인 경우 모달을 열어서 성공 메시지를 표시
                openModal("이벤트가 성공적으로 등록되었습니다!", moveToList);
            } else {
                // RESULT가 "SUCCESS"가 아닌 경우 실패 모달 표시
                openModal("이벤트 등록에 실패했습니다.");
            }
        }).catch(error => {
            exceptionHandler(error);
        });
    };

    return (
        <div className="bg-white p-7 rounded w-9/12 mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* 이벤트 제목 */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="title"
                            label="이벤트 제목"
                            value={event.title}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>
                    {/* 이벤트 내용 */}
                    <div className="mb-4 md:col-span-4">
                        <Textarea
                            name="contents"
                            label="이벤트 내용"
                            value={event.contents}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>
                    {/* 이벤트 시작일 */}
                    <div className="mb-4">
                        <Input
                            type="date"
                            name="startDate"
                            label="이벤트 시작일"
                            value={event.startDate}
                            required
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    {/* 이벤트 마감일 */}
                    <div className="mb-4">
                        <Input
                            type="date"
                            name="endDate"
                            label="이벤트 마감일"
                            value={event.endDate}
                            required
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    {/* 이벤트 상태 */}
                    <div className="mb-4">
                        <Select
                            label="이벤트 상태"
                            name="eventState"
                            value={event.eventState}
                            onChange={(e) => setEvent({ ...event, eventState: e })}
                            className="w-full"
                        >
                            <Option value="01">진행전</Option>
                            <Option value="02">진행중</Option>
                            <Option value="03">마감</Option>
                        </Select>
                    </div>
                </div>

                {/* 상품 이미지 */}
                <label className="block text-gray-700 font-bold mb-2">이벤트 이미지</label>
                <div
                    className="relative flex flex-col p-4 text-gray-400 border border-gray-200 rounded transition-all ease-in-out duration-300"
                    {...getMainDropzoneProps()}
                >
                    <input {...getMainInputProps()} />
                    <div
                        className="relative flex flex-col text-gray-400 border border-gray-200 border-dashed rounded cursor-pointer py-10 text-center"
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {files && files.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded cursor-default select-none"
                                        style={{ paddingTop: "100%", position: "relative" }}
                                    >
                                        <img
                                            src={file.preview}
                                            className="absolute inset-0 object-cover w-full h-full"
                                            alt={file.name}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-xs py-1">
                                            {file.name} ({eventImageFileSize(file.size)})
                                            <button
                                                onClick={(event) => removeFile( index, event)}
                                                className="absolute top-0 right-0 m-1 text-sm text-red-500"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="m-4">이벤트 이미지를 드래그하거나 클릭하여 추가하세요.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
                    >
                        등록
                    </button>
                </div>
            </form>

            {/* 모달 */}
            <Dialog open={modalOpen} handler={closeModal}>
                <DialogHeader>알림</DialogHeader>
                <DialogBody>{modalMessage}</DialogBody>
                <DialogFooter>
                    <Button onClick={closeModal}>확인</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default CreateComponent;