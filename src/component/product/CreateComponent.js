// ListComponent.js
import React, {useState} from "react";
import {useDropzone} from "react-dropzone";
import '../../pages/product/ProductList.css'; // Add your custom CSS
import axios from "axios";
import useCustomMove from "../hooks/useCustomMove";
import {Input, Textarea, Select, Option} from "@material-tailwind/react";

const CreateComponent = () => {
    const [product, setProduct] = useState({
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
        wishCount: ""
    });

    const {page, size, refresh, moveToList, moveToRead, moveToCreate} = useCustomMove()
    // Other state variables
    const [files, setFiles] = useState([]);
    const [descImages, setDescImages] = useState([]);
    const [mainFileDragging, setMainFileDragging] = useState(null);
    const [mainFileDropping, setMainFileDropping] = useState(null);
    const [descFileDragging, setDescFileDragging] = useState(null);
    const [descFileDropping, setDescFileDropping] = useState(null);

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
        multiple: false,
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

        const requiredFields = [
            { name: 'productName', label: '상품명' },
            { name: 'retailPrice', label: '상품 가격' },
            { name: 'salePrice', label: '판매 가격' },
            { name: 'manufacture', label: '제조사' },
            { name: 'origin', label: '원산지' },
            { name: 'quantity', label: '수량' },
            { name: 'expirationDate', label: '유통기한' },
            { name: 'manufactureDate', label: '제조일자' },
            { name: 'saleCompany', label: '판매사' }
        ];

        for (let field of requiredFields) {

            console.log("ssssssssss:{}",product)
            if (!product[field.name]) {


                console.log(field.name)

                console.log(field.label)

                alert(field.label+`is required!`);


                const inputElement = document.getElementsByName(field.name);

                console.log(inputElement)

                if (inputElement) {
                    inputElement.focus(); // Focus on the first invalid input
                }
                return; // Stop form submission if validation fails
            }
        }


        // Check if at least one main product image is uploaded
        if (files.length === 0) {
            alert("상품이미지는 하나 이상 있어야 합니다.!");
            return; // Stop form submission if no images are uploaded
        }

        // Check if at least one description image is uploaded
        if (descImages.length === 0) {
            alert("상품 설명 이미지는 하나 이상 있어야 합니다.");
            return; // Stop form submission if no description images are uploaded
        }


        const formData = new FormData();
        Object.keys(product).forEach((key) => {
            formData.append(key, product[key]);
        });

        files.forEach((file) => {
            formData.append("files", file, file.name);
        });

        descImages.forEach((file) => {
            formData.append("descFiles", file, file.name);
        });

        try {
            const response = await axios.post("http://localhost:8080/admin/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(res => {
                const result = res.data.RESULT;
                if (result === "SUCCESS") {
                    alert("Operation was successful!");
                    moveToList()
                } else {
                    alert("Operation failed.");
                }
            });

            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error uploading product:", error);
        }
    };


    return (
        <div className="bg-white p-7 rounded w-9/12 mx-auto">
            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* 상품명 */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="productName"
                            label="상품명"
                            value={product.productName}
                            onChange={handleInputChange}
                            required
                            className="w-full"
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
                            type="number"
                            name="retailPrice"
                            label="상품 가격"
                            value={product.retailPrice}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* 세일 가격 */}
                    <div className="mb-4">
                        <Input
                            type="number"
                            name="salePrice"
                            label="판매 가격"
                            value={product.salePrice}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* 상품 유형 */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="type"
                            label="상품 유형"
                            value={product.type}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4 md:col-span-4">
                        <Textarea
                            name="productDetail"
                            label="상품설명"
                            value={product.productDetail}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    {/* 제조사 */}
                    <div className="mb-4">

                        <Input
                            type="text"
                            name="manufacture"
                            label="제조사"
                            value={product.manufacture}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* 브랜드 */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="brand"
                            label="브랜드"
                            value={product.brand}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    {/* 원산지 */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="origin"
                            label="원산지"
                            value={product.origin}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* 재질 */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="material"
                            label="재질"
                            value={product.material}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* 수량 */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="quantity"
                            label="수량"
                            value={product.quantity}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* 패키지 수량 */}
                    <div className="mb-4">

                        <Input
                            type="text"
                            name="packageQuantity"
                            label="패키지 수량"
                            value={product.packageQuantity}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    {/* 유통기한 */}
                    <div className="mb-4">
                        <Input
                            type="date"
                            name="expirationDate"
                            label="유통기한"
                            value={product.expirationDate}
                            required
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    {/* 제조일자 */}
                    <div className="mb-4">

                        <Input
                            type="date"
                            name="manufactureDate"
                            label="제조일자"
                            value={product.manufactureDate}
                            required
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    {/* 노출 여부 */}
                    <div className="mb-4">
                        <Select
                            label="노출 여부"
                            name="isVisible"
                            value={product.isVisible.toString()}
                            onChange={(e) => setProduct({...product, isVisible: e === "true"})}
                            className="w-full"
                        >
                            <Option value="true">예</Option>
                            <Option value="false">아니오</Option>
                        </Select>
                    </div>

                    {/* 삭제 여부 */}
                    <div className="mb-4">
                        <Select
                            label="삭제 여부"
                            name="isDeleted"
                            value={product.isDeleted.toString()}
                            onChange={(e) => setProduct({...product, isDeleted: e === "true"})}
                            className="w-full"
                        >
                            <Option value="true">예</Option>
                            <Option value="false">아니오</Option>
                        </Select>
                    </div>

                    {/* 품절 여부 */}
                    <div className="mb-4">

                        <Select
                            label="품절 여부"
                            name="isSoldout"
                            value={product.isSoldout.toString()}
                            onChange={(e) => setProduct({...product, isSoldout: e === "true"})}
                            className="w-full"
                        >
                            <Option value="true">예</Option>
                            <Option value="false">아니오</Option>
                        </Select>
                    </div>

                    {/* GMO 여부 */}
                    <div className="mb-4">

                        <Select
                            label="GMO 여부"
                            name="isGmo"
                            value={product.isGmo.toString()}
                            onChange={(e) => setProduct({...product, isGmo: e === "true"})}
                            className="w-full"
                        >
                            <Option value="true">예</Option>
                            <Option value="false">아니오</Option>
                        </Select>
                    </div>

                    {/* 용량 (ml) */}
                    <div className="mb-4">

                        <Input
                            type="number"
                            name="volume"
                            label="용량 (ml)"
                            value={product.volume}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>


                    {/* 판매사 */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="saleCompany"
                            label="판매사"
                            value={product.saleCompany}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>
                    {/* 판매사 정보 */}
                    <div className="mb-4 md:col-span-4">
                        <Textarea
                            name="saleCompanyInfo"
                            label="판매사 정보"
                            value={product.saleCompanyInfo}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    {/* 주의 사항 */}
                    <div className="mb-4 md:col-span-4">
                        <Textarea
                            name="caution"
                            label="주의 사항"
                            value={product.caution}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    {/* 기타 입력 필드들 */}
                    {/* 영양 정보 */}
                    <div className="mb-4 md:col-span-4">
                        <Textarea
                            name="nutrition"
                            label="영양 정보"
                            value={product.nutrition}
                            onChange={handleInputChange}
                            className="w-full"
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
                                                <span
                                                    className="w-full font-bold text-gray-900 truncate">{file.name}</span>
                                            <span
                                                className="text-xs text-gray-900">{humanFileSize(file.size)}</span>
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
                                                <span
                                                    className="w-full font-bold text-gray-900 truncate">{file.name}</span>
                                            <span
                                                className="text-xs text-gray-900">{humanFileSize(file.size)}</span>
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
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">상품등록
                </button>
            </form>
        </div>
    );
};

export default CreateComponent;
