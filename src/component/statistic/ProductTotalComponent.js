import { Chart } from 'react-google-charts';
import {useEffect, useState} from "react";
import { getProductTotal} from "../../api/statisticApi";
import useCustomLogin from "../hooks/useCustomLogin";

const ProductTotalComponent = () => {

    const {exceptionHandle} = useCustomLogin()


    const [data, setData] = useState([]);

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useEffect(() => {
        getProductTotal().then(data => {
            setData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            exceptionHandle(error)
        });
    }, []);


    const chartData = [
        ['상품명', '총구매액'],
        ...data.map(item => [String(item.productName), parseFloat(item.totalAmount)]),
    ];

    const options = {
        title: `상품별 총 구매 금액`,
        hAxis: { title: '상품' },
        vAxis: { title: '총 구매액' },
        legend: 'none',
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFC300'], // High-contrast colors
    };

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg w-full">
            <h2 className="text-lg font-semibold mb-4">상품별 총 구매 통계</h2>
            {data.length > 0 ? (
                <Chart
                    chartType="ColumnChart"
                    data={chartData}
                    options={options}
                    width="100%"
                    height="400px"
                    loader={<div>Loading Chart...</div>}
                />
            ) : (
                <div className="text-center mt-4">데이터가 없습니다.</div>
            )}
        </div>
    );
};

export default ProductTotalComponent;
