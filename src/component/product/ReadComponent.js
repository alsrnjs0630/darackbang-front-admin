// ListComponent.js
import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import '../../pages/product/ProductList.css'; // Add your custom CSS
import {Input, Button, Textarea, Select, Option} from "@material-tailwind/react";
import {activateProduct, create, updateProduct, deleteProduct, getOne} from "../../api/productApi"
import {Dialog, DialogHeader, DialogBody, DialogFooter} from "@material-tailwind/react";

import {API_SERVER_HOST} from "../../api/host";

import axios from "axios";
import useCustomMove from "../hooks/useCustomMove";
import useCustomLogin from "../hooks/useCustomLogin";


const initState = {
    id: "",
    pno: "",
    productName: "",
    productDetail: "",
    retailPrice: "",
    salePrice: "",
    type: "",
    caution: "",
    isVisible: true,
    manufacture: "",
    brand: "",
    origin: "",
    material: "",
    category: "",
    saleCompany: "",
    saleCompanyInfo: "",
    isDeleted: false,
    isSoldout: false,
    nutrition: "",
    quantity: "",
    packageQuantity: "",
    expirationDate: "",
    manufactureDate: "",
    isGmo: false,
    volume: "",
    wishCount: "",
    productImages: [],
    createdDate: "",
    updatedDate: "",
}


const ReadComponent = ({id}) => {

    console.log("아이티::::::::::{}", id)

    const {page, size, refresh, moveToList, moveToRead, moveToCreate} = useCustomMove()
    // Other state variables
    const [files, setFiles] = useState([]);
    const [descImages, setDescImages] = useState([]);
    const [mainFileDragging, setMainFileDragging] = useState(null);
    const [mainFileDropping, setMainFileDropping] = useState(null);
    const [descFileDragging, setDescFileDragging] = useState(null);
    const [descFileDropping, setDescFileDropping] = useState(null);

    const [product, setProduct] = useState(initState);

    const {exceptionHandle} = useCustomLogin()

    // 모달 상태 관리
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onCloseCallback, setOnCloseCallback] = useState(null); // 모달 닫힐 때 실행할 콜백


    const confirmModal = (message, onConfirm) => {
        openModal(message, onConfirm);
    };

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


    const humanFileSize = (size) => {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) + " " + ["B", "kB", "MB", "GB", "TB"][i];
    };

    const removeFile = (fileType, index, event) => {
        event.stopPropagation();

        if (fileType === 'main') {
            const updatedFiles = [...files];
            updatedFiles.splice(index, 1);
            setFiles(updatedFiles);
        } else if (fileType === 'desc') {
            const updatedDescImages = [...descImages];
            updatedDescImages.splice(index, 1);
            setDescImages(updatedDescImages);
        }
    };

    const onDrop = (acceptedFiles, type) => {
        const newFiles = acceptedFiles.map((file) =>
            Object.assign(file, {preview: URL.createObjectURL(file)})
        );
        if (type === 'main') {
            setFiles([...files, ...newFiles]);
        } else if (type === 'desc') {
            setDescImages([...descImages, ...newFiles]);
        }
    };

    const handleMainDragEnd = () => {
        const updatedFiles = [...files];
        const draggedFile = updatedFiles.splice(mainFileDragging, 1)[0];
        updatedFiles.splice(mainFileDropping, 0, draggedFile);
        setFiles(updatedFiles);
        setMainFileDragging(null);
        setMainFileDropping(null);
    };

    const mainDragEnter = (event) => {
        const targetElem = event.target.closest("[draggable]");
        setMainFileDropping(parseInt(targetElem.getAttribute("data-index"), 10));
    };

    const mainDragStart = (event) => {
        setMainFileDragging(parseInt(event.target.closest("[draggable]").getAttribute("data-index"), 10));
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDescDragEnd = () => {
        const updatedDescImages = [...descImages];
        const draggedFile = updatedDescImages.splice(descFileDragging, 1)[0];
        updatedDescImages.splice(descFileDropping, 0, draggedFile);
        setDescImages(updatedDescImages);
        setDescFileDragging(null);
        setDescFileDropping(null);
    };

    const descDragEnter = (event) => {
        const targetElem = event.target.closest("[draggable]");
        setDescFileDropping(parseInt(targetElem.getAttribute("data-index"), 10));
    };

    const descDragStart = (event) => {
        setDescFileDragging(parseInt(event.target.closest("[draggable]").getAttribute("data-index"), 10));
        event.dataTransfer.effectAllowed = "move";
    };

    const {getRootProps: getMainDropzoneProps, getInputProps: getMainInputProps} = useDropzone({
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'main'),
        accept: {"image/*": []},
        multiple: true,
    });

    const {getRootProps: getDescDropzoneProps, getInputProps: getDescInputProps} = useDropzone({
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'desc'),
        accept: {"image/*": []},
        multiple: true,
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        const productImages = []; // Array to store the names of non-file objects (e.g., Blob, URLs)


        Object.keys(product).forEach((key) => {
            // Exclude specific keys and null values
            if (!['productImages', 'createdDate', 'updatedDate'].includes(key) && product[key] !== null) {
                formData.append(key, product[key]);
            }
        });


        // Process main product images
        files.forEach((file, index) => {
            const sequenceNumber = index + 1; // Add sequence number for desc images
            if (file instanceof File) {
                console.log(`파일 추가 (File ${sequenceNumber}):`, file.name);
                formData.append("files", file, `${sequenceNumber}_${file.name}`);
            } else {
                // Add structured image info to productImages array

                // Push the updated fileInfo to productImages array
                productImages.push(
                    {
                        type: "INFO",
                        sortNum: sequenceNumber,
                        fileName: file.name
                    }
                );
            }
        });

        // Process description images
        descImages.forEach((file, index) => {
            const sequenceNumber = index + 1; // Add sequence number for desc images
            if (file instanceof File) {
                console.log(`파일 추가 (File ${sequenceNumber}):`, file.name);
                formData.append("descFiles", file, `${sequenceNumber}_${file.name}`);

            } else {
                productImages.push(
                    {
                        type: "DESC",
                        sortNum: sequenceNumber,
                        fileName: file.name
                    }
                );
            }
        });

        // Add productImages array to the form data
        formData.append("productImages", JSON.stringify(productImages));


        updateProduct(formData).then(result => {

            console.log(result);

            if (result.RESULT === "SUCCESS") {
                // RESULT가 "SUCCESS"인 경우 모달을 열어서 성공 메시지를 표시
                openModal("상품 수정에 성공하였습니다.");
            } else {
                // RESULT가 "SUCCESS"가 아닌 경우 실패 모달 표시
                openModal("상품 수정에 실패했습니다.");
            }

        }).catch(error => {
            exceptionHandle(error)
        });

    };


    useEffect(() => {
        getOne(id).then(data => {
            console.log(data);
            setProduct(data);
            // Load existing images into the respective arrays based on productType
            const infoImages = data.productImages
                .filter((img) => img.productType === "INFO")
                .map((img) => ({
                    ...img,
                    name: img.productFileName,
                    type: "image/*",
                    size: 50000,
                    preview: `${API_SERVER_HOST}/admin/products/view/${img.productFileName}`, // Assuming a path where images are served
                    existing: true, // Mark existing images
                }));
            const descImages = data.productImages
                .filter((img) => img.productType === "DESC")
                .map((img) => ({
                    ...img,
                    name: img.productFileName,
                    type: "image/*",
                    size: 50000,
                    preview: `${API_SERVER_HOST}/admin/products/view/${img.productFileName}`, // Assuming a path where images are served
                    existing: true, // Mark existing images
                }));

            setFiles(infoImages);
            setDescImages(descImages);
        }).catch(error=>{
            exceptionHandle(error)
        });

    }, [id])


    // Function to handle delete
    const handleDelete = async () => {
        confirmModal("정말로 이 상품을 삭제하시겠습니까?", async () => {

            deleteProduct(id).then(result => {

                if (result.RESULT === "SUCCESS") {
                    openModal("상품 삭제에 성공하였습니다!", moveToList);
                } else {
                    openModal("상품 삭제에 실패했습니다.");
                }

            }).catch(error => {
                exceptionHandle(error)
            });

        });
    };


    // Function to handle delete
    const handleActive = async () => {
        confirmModal("정말로 이 상품을 활성화하시겠습니까?", async () => {

            activateProduct(id).then(result => {

                if (result.RESULT === "SUCCESS") {
                    openModal("상품 활성화에 성공하였습니다.", moveToList);
                } else {
                    openModal("상품 활성화에 실패했습니다.");
                }

            }).catch(error => {
                exceptionHandle(error)
            });

        });
    };


    return (
        <div className="bg-white p-7 rounded w-9/12 mx-auto">
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="hidden"
                        name="id"
                        className="w-full px-3 py-2 border rounded"
                        value={product.id}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* 상품명 */}
                    <div className="mb-4">
                        <Input
                            label="상품명"
                            name="productName"
                            value={product.productName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* 카테고리 */}
                    <div className="mb-4">
                        <Select
                            label="카테고리"
                            name="category"
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e })}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <Option value="L01">잎차</Option>
                            <Option value="B01">티백</Option>
                            <Option value="F01">열매</Option>
                        </Select>
                    </div>
                    {/* 상품 가격 */}
                    <div className="mb-4">
                        <Input
                            label="상품 가격"
                            name="retailPrice"
                            type="number"
                            value={product.retailPrice}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* 세일 가격 */}
                    <div className="mb-4">
                        <Input
                            label="세일 가격"
                            name="salePrice"
                            type="number"
                            value={product.salePrice}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* 상품 유형 */}
                    <div className="mb-4">
                        <Input
                            label="상품 유형"
                            name="type"
                            value={product.type === "null" ? "" : product.type}
                            onChange={handleInputChange}
                        />
                    </div>


                    {/* 상품설명 */}
                    <div className="mb-4 md:col-span-4">
                        <Textarea
                            label="상품 설명"
                            name="productDetail"
                            value={product.productDetail === "null" ? "" : product.productDetail}
                            onChange={handleInputChange}
                        />
                    </div>


                    {/* 제조사 */}
                    <div className="mb-4">
                        <Input
                            label="제조사"
                            name="manufacture"
                            value={product.manufacture === "null" ? "" : product.manufacture}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 브랜드 */}
                    <div className="mb-4">
                        <Input
                            label="브랜드"
                            name="brand"
                            value={product.brand === "null" ? "" : product.brand}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 원산지 */}
                    <div className="mb-4">
                        <Input
                            label="원산지"
                            name="origin"
                            value={product.origin === "null" ? "" : product.origin}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 재질 */}
                    <div className="mb-4">
                        <Input
                            label="재질"
                            name="material"
                            value={product.material === "null" ? "" : product.material}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 카테고리 */}
                    <div className="mb-4">
                        <Select
                            label="카테고리"
                            name="category"
                            value={product.category} // Bind the value directly to product.category
                            onChange={(e) => setProduct({...product, category: e})}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <Option value="L01">잎차</Option>
                            <Option value="B01">티백</Option>
                            <Option value="F01">열매</Option>
                        </Select>
                    </div>

                    {/* 판매사 */}
                    <div className="mb-4">
                        <Input
                            label="판매사"
                            name="saleCompany"
                            value={product.saleCompany === "null" ? "" : product.saleCompany}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 수량 */}
                    <div className="mb-4">
                        <Input
                            label="수량"
                            name="quantity"
                            type="number"
                            value={product.quantity === "null" ? "" : product.quantity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* 패키지 수량 */}
                    <div className="mb-4">
                        <Input
                            label="패키지 수량"
                            name="packageQuantity"
                            type="number"
                            value={product.packageQuantity === "null" ? "" : product.packageQuantity}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 유통기한 */}
                    <div className="mb-4">
                        <Input
                            label="유통기한"
                            name="expirationDate"
                            type="date"
                            value={product.expirationDate === "null" ? "" : product.expirationDate}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 제조일자 */}
                    <div className="mb-4">
                        <Input
                            label="제조일자"
                            name="manufactureDate"
                            type="date"
                            value={product.manufactureDate === "null" ? "" : product.manufactureDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4 md:col-span-4">

                    </div>
                    {/* 노출 여부 */}
                    <div className="mb-4">
                        <Select
                            label="노출 여부"
                            value={product.isVisible ? "true" : "false"}
                            onChange={(e) => setProduct({...product, isVisible: e === "true"})}
                        >
                            <Option value="true">예</Option>
                            <Option value="false">아니오</Option>
                        </Select>
                    </div>

                    {/* 품절 여부 */}
                    <div className="mb-4">
                        <Select
                            label="품절 여부"
                            value={product.isSoldout ? "true" : "false"}
                            onChange={(e) => setProduct({...product, isSoldout: e === "true"})}
                        >
                            <Option value="true">예</Option>
                            <Option value="false">아니오</Option>
                        </Select>
                    </div>

                    {/* GMO 여부 */}
                    <div className="mb-4">
                        <Select
                            label="GMO 여부"
                            value={product.isGmo ? "true" : "false"}
                            onChange={(e) => setProduct({...product, isGmo: e === "true"})}
                        >
                            <Option value="true">예</Option>
                            <Option value="false">아니오</Option>
                        </Select>
                    </div>

                    {/* 용량 (ml) */}
                    <div className="mb-4">
                        <Input
                            label="용량 (ml)"
                            type="number"
                            name="volume"
                            value={product.volume === "null" ? "" : product.volume}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* 주의 사항 */}
                    <div className="mb-4 md:col-span-4">
                        <Textarea
                            label="주의 사항"
                            name="caution"
                            value={product.caution === "null" ? "" : product.caution}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* 영양 정보 */}
                    <div className="mb-4 md:col-span-4">
                        <Textarea
                            label="영양 정보"
                            name="nutrition"
                            value={product.nutrition === "null" ? "" : product.nutrition}
                            onChange={handleInputChange}
                        />
                    </div>


                    {/* 판매사 정보 */}
                    <div className="mb-4 md:col-span-4">

                        <Textarea
                            label="판매사 정보"
                            name="saleCompanyInfo"
                            value={product.saleCompanyInfo === "null" ? "" : product.saleCompanyInfo}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>


                {/* 상품 이미지 */}
                <label className="block text-gray-700 font-bold mb-2">상품 이미지</label>
                <div
                    className="relative flex flex-col p-4 text-gray-400 border border-gray-200 rounded transition-all ease-in-out duration-300"
                    {...getMainDropzoneProps()}
                >
                    <input {...getMainInputProps()} />
                    <div
                        className="relative flex flex-col text-gray-400 border border-gray-200 border-dashed rounded cursor-pointer py-10 text-center"
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {files.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded cursor-move select-none"
                                        style={{paddingTop: "100%"}}
                                        draggable="true"
                                        onDragStart={mainDragStart}
                                        onDragEnter={mainDragEnter}
                                        onDragEnd={handleMainDragEnd}
                                        data-index={index}
                                    >
                                        <button
                                            className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none"
                                            type="button"
                                            onClick={(event) => removeFile('main', index, event)}
                                        >
                                            X
                                        </button>

                                        {file.type.includes("image/") && (
                                            <img
                                                className="absolute inset-0 z-0 object-cover w-full h-full border-4 border-white preview"
                                                src={file.preview}
                                                alt={file.name}
                                            />
                                        )}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 flex flex-col p-2 text-xs bg-white bg-opacity-50">
                                            <span className="w-full font-bold text-gray-900 truncate">{file.name}</span>
                                            <span className="text-xs text-gray-900">{humanFileSize(file.size)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="m-0">여기에 상품 이미지를 끌어다 놓거나 클릭하십시오.</p>
                        )}
                    </div>
                </div>

                {/* 상품 설명 이미지 */}
                <label className="block text-gray-700 font-bold mb-2 mt-6">상품 설명 이미지</label>
                <div
                    className="relative flex flex-col p-4 text-gray-400 border border-gray-200 rounded mt-6 transition-all ease-in-out duration-300"
                    {...getDescDropzoneProps()}
                >
                    <input {...getDescInputProps()} />
                    <div
                        className="relative flex flex-col text-gray-400 border border-gray-200 border-dashed rounded cursor-pointer py-10 text-center"
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {descImages.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                                {descImages.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded cursor-move select-none"
                                        style={{paddingTop: "100%"}}
                                        draggable="true"
                                        onDragStart={descDragStart}
                                        onDragEnter={descDragEnter}
                                        onDragEnd={handleDescDragEnd}
                                        data-index={index}
                                    >
                                        <button
                                            className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none"
                                            type="button"
                                            onClick={(event) => removeFile('desc', index, event)}
                                        >
                                            X
                                        </button>

                                        {file.type.includes("image/") && (
                                            <img
                                                className="absolute inset-0 z-0 object-cover w-full h-full border-4 border-white preview"
                                                src={file.preview}
                                                alt={file.name}
                                            />
                                        )}

                                        <div
                                            className="absolute bottom-0 left-0 right-0 flex flex-col p-2 text-xs bg-white bg-opacity-50">
                                            <span className="w-full font-bold text-gray-900 truncate">{file.name}</span>
                                            <span className="text-xs text-gray-900">{humanFileSize(file.size)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="m-0">여기에 상품 설명 이미지를 끌어다 놓거나 클릭하십시오.</p>
                        )}
                    </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-center items-center mt-4 space-x-4">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                        수정
                    </button>

                    <button
                        type="button"
                        className={`px-4 py-2 text-white rounded ${product.isDeleted ? 'bg-green-500' : 'bg-red-500'}`}
                        onClick={() => {
                            if (product.isDeleted) {
                                handleActive(); // Call handleActive if product is deleted
                            } else {
                                handleDelete(); // Call handleDelete if product is not deleted
                            }
                        }}
                    >
                        {product.isDeleted ? '삭제 취소' : '삭제'}
                    </button>

                </div>
            </form>


            {/* 모달 */}
            <Dialog open={modalOpen} handler={closeModal}>
                <DialogHeader>알림</DialogHeader>
                <DialogBody>
                    <span style={{color: "black"}}>{modalMessage}</span>
                </DialogBody>
                <DialogFooter>
                    <Button color="blue" onClick={closeModal}>확인</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ReadComponent;
