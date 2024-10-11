import { Chart } from 'react-google-charts';
import {useEffect, useState} from "react";
import {getAgeGroupTotal} from "../../api/statisticApi";


const AgeTotalComponent = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        getAgeGroupTotal().then(data => {
            setData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            console.log("error results:", error); // Output the data to console
        });
    }, []);


    const chartData = [
        ['Age Group', 'Total Amount'],
        ...data.map(item => [String(item.ageGroup), parseFloat(item.totalAmount)]),
    ];

    const options = {
        title: `연령별 총 구매 금액`, // 차트 제목
        hAxis: { title: '연령대' }, // 수평축 제목
        vAxis: { title: '총 구매액' }, // 수직축 제목
        legend: 'none', // 범례 표시 안함
        colors: ['#FF5733'], // 한 가지 색상만 지정
    };

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg w-full"> {/* 가로 너비를 꽉 채우도록 설정 */}
            <h2 className="text-lg font-semibold mb-4">연령별 총 구매 금액</h2>
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

export default AgeTotalComponent;
