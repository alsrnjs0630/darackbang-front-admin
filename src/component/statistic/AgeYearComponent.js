import { Chart } from 'react-google-charts';
import {useEffect, useState} from "react";

import {getAgeGroupYearStat} from "../../api/statisticApi";
import useCustomLogin from "../hooks/useCustomLogin";

const AgeYearComponent = () => {

    const {exceptionHandle} = useCustomLogin()

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const [year, setYear] = useState(currentYear); // Default year
    const [data, setData] = useState([]);

    useEffect(() => {
        getAgeGroupYearStat(year).then(data => {
            setData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            exceptionHandle(error)
        });
    }, [year]);


    const chartData = [
        ['연령대', '총구매액'],
        ...data.map(item => [String(item.ageGroup)+'대', parseFloat(item.totalAmount)]),
    ];

    const onYearChange = (e) => {
        const selectedYear = Number(e.target.value);

        setYear(selectedYear);

        getAgeGroupYearStat(selectedYear).then(data => {
            setData(data);
            console.log("Search results:", data); // Output the data to console
        }).catch(error => {
            exceptionHandle(error)
        });
    };


    const options = {
        title: `연령별 총 구매 금액 (${currentYear}년)`,
        hAxis: { title: '연령대' },
        vAxis: { title: '총 구매액' },
        legend: 'none',
    };


    return (
        <div className="p-3 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">연령별 연도 구매 통계</h2>
            <div className="flex justify-end mb-4 space-x-4">
                <div className="w-1/2">
                    <label htmlFor="year-select" className="block mb-1 font-medium">년도</label>
                    <select
                        id="year-select"
                        value={year}
                        onChange={onYearChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {[...Array(currentYear - 2024 + 1)].map((_, index) => {
                            const optionYear = 2024 + index;
                            return (
                                <option key={optionYear} value={optionYear}>
                                    {optionYear}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

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

export default AgeYearComponent;
